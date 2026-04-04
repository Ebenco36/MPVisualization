import { io } from 'socket.io-client'
import globalFigs from '@/config/constants'

const STRUCTURE_NOTES_NAMESPACE = '/structure-notes'
const STRUCTURE_NOTES_EVENT = 'structure_note_updated'

let socket = null
let activeToken = null
const subscribers = new Set()
const roomRefCounts = new Map()
let listenersBound = false

function normalizeCode(value) {
  const text = String(value || '').trim().toUpperCase()
  return text || null
}

function resolveSocketBaseUrl() {
  const explicitUrl = import.meta.env.VITE_MPV_SOCKET_URL
  if (explicitUrl) {
    return String(explicitUrl).replace(/\/$/, '')
  }

  const apiBaseUrl = import.meta.env.VITE_MPV_APP_URL || window.location.origin
  try {
    const url = new URL(apiBaseUrl, window.location.origin)
    url.pathname = url.pathname.replace(/\/api\/v\d+\/?$/, '/')
    url.pathname = url.pathname.replace(/\/api\/v\d+\/.*$/, '/')
    url.search = ''
    url.hash = ''
    return url.toString().replace(/\/$/, '')
  } catch (error) {
    console.warn('Could not resolve structure note socket base URL from API base:', error)
    return window.location.origin.replace(/\/$/, '')
  }
}

function currentToken() {
  return localStorage.getItem(globalFigs.token) || ''
}

function handleStructureNoteEvent(payload) {
  subscribers.forEach((callback) => {
    try {
      callback(payload)
    } catch (error) {
      console.error('Structure notes realtime subscriber failed:', error)
    }
  })
}

function resubscribeActiveRooms() {
  if (!socket?.connected || roomRefCounts.size === 0) return
  socket.emit('subscribe_structure_notes', {
    pdb_codes: Array.from(roomRefCounts.keys())
  })
}

function bindSocketListeners() {
  if (!socket || listenersBound) return
  socket.on('connect', resubscribeActiveRooms)
  socket.on(STRUCTURE_NOTES_EVENT, handleStructureNoteEvent)
  socket.on('connect_error', (error) => {
    console.warn('Structure notes realtime connection error:', error?.message || error)
  })
  listenersBound = true
}

function unbindSocketListeners() {
  if (!socket || !listenersBound) return
  socket.off('connect', resubscribeActiveRooms)
  socket.off(STRUCTURE_NOTES_EVENT, handleStructureNoteEvent)
  listenersBound = false
}

function ensureSocket() {
  const token = currentToken()
  if (socket && activeToken === token) {
    bindSocketListeners()
    return socket
  }

  if (socket) {
    unbindSocketListeners()
    socket.disconnect()
    socket = null
  }

  activeToken = token
  socket = io(`${resolveSocketBaseUrl()}${STRUCTURE_NOTES_NAMESPACE}`, {
    path: import.meta.env.VITE_MPV_SOCKET_PATH || '/socket.io',
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 10000,
    auth: {
      token,
    },
  })
  bindSocketListeners()
  return socket
}

function emitRoomUpdate(eventName, pdbCodes) {
  if (!socket?.connected || !Array.isArray(pdbCodes) || pdbCodes.length === 0) return
  socket.emit(eventName, { pdb_codes: pdbCodes })
}

class StructureNotesRealtimeService {
  subscribeToStructureNotes(pdbCodes, callback) {
    const normalizedCodes = Array.from(
      new Set((pdbCodes || []).map((value) => normalizeCode(value)).filter(Boolean))
    )
    const newCodes = []

    if (typeof callback === 'function') {
      subscribers.add(callback)
    }

    normalizedCodes.forEach((code) => {
      const currentCount = roomRefCounts.get(code) || 0
      roomRefCounts.set(code, currentCount + 1)
      if (currentCount === 0) {
        newCodes.push(code)
      }
    })

    const currentSocket = ensureSocket()
    const subscribeRooms = () => emitRoomUpdate('subscribe_structure_notes', newCodes)

    if (currentSocket.connected) {
      subscribeRooms()
    } else if (newCodes.length) {
      currentSocket.once('connect', subscribeRooms)
    }

    return () => {
      const removedCodes = []
      normalizedCodes.forEach((code) => {
        const currentCount = roomRefCounts.get(code) || 0
        if (currentCount <= 1) {
          roomRefCounts.delete(code)
          removedCodes.push(code)
          return
        }
        roomRefCounts.set(code, currentCount - 1)
      })

      if (typeof callback === 'function') {
        subscribers.delete(callback)
      }

      emitRoomUpdate('unsubscribe_structure_notes', removedCodes)

      if (subscribers.size === 0 && roomRefCounts.size === 0 && socket) {
        unbindSocketListeners()
        socket.disconnect()
        socket = null
        activeToken = null
      }
    }
  }
}

export default new StructureNotesRealtimeService()
