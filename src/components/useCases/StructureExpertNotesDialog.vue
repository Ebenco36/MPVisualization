<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import StructureNotesService from '@/services/structure_notes.service'
import StructureNotesRealtimeService from '@/services/structure_notes_realtime.service'

const props = defineProps({
  pdbCode: {
    type: String,
    required: true,
  },
  initialCount: {
    type: Number,
    default: 0,
  },
  summary: {
    type: Object,
    default: () => ({}),
  },
  triggerLabel: {
    type: String,
    default: 'Notes',
  },
  triggerMode: {
    type: String,
    default: 'icon',
  },
  sourceContext: {
    type: [String, Object],
    default: null,
  },
})

const emit = defineEmits(['updated'])

const dialog = ref(false)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const notes = ref([])
const form = ref({
  title: '',
  category: 'annotation',
  suggested_group: '',
  suggested_tm_count: null,
  comment: '',
})
const noteSummary = ref({
  note_count: 0,
  open_note_count: 0,
  latest_note_at: null,
  latest_note_excerpt: null,
  recent_notes: [],
})
let stopRealtimeSubscription = null

const categoryItems = [
  { title: 'Annotation', value: 'annotation' },
  { title: 'Topology', value: 'topology' },
  { title: 'Benchmark', value: 'benchmark' },
  { title: 'Data quality', value: 'data_quality' },
  { title: 'Literature', value: 'literature' },
  { title: 'Other', value: 'other' },
]

function normalizeSummary(value) {
  return {
    note_count: Number(value?.note_count || props.initialCount || 0),
    open_note_count: Number(value?.open_note_count || 0),
    latest_note_at: value?.latest_note_at || null,
    latest_note_excerpt: value?.latest_note_excerpt || null,
    recent_notes: Array.isArray(value?.recent_notes) ? value.recent_notes : [],
  }
}

watch(
  () => props.summary,
  (value) => {
    noteSummary.value = normalizeSummary(value)
  },
  { immediate: true, deep: true }
)

const displayCount = computed(() => Number(noteSummary.value.note_count || props.initialCount || 0))
const openCount = computed(() => Number(noteSummary.value.open_note_count || 0))
const latestExcerpt = computed(() => noteSummary.value.latest_note_excerpt || 'No expert notes yet.')

function normalizeCode(value) {
  const text = String(value || '').trim().toUpperCase()
  return text || null
}

function appliesToStructure(payload) {
  const structureCode = normalizeCode(props.pdbCode)
  if (!structureCode) return false
  const payloadCodes = [payload?.pdb_code, payload?.canonical_pdb_code]
    .map((value) => normalizeCode(value))
    .filter(Boolean)
  return payloadCodes.includes(structureCode)
}

function mergeNoteItem(note) {
  if (!note?.id) return
  const existing = new Map(notes.value.map((item) => [item.id, item]))
  existing.set(note.id, note)
  notes.value = Array.from(existing.values()).sort((left, right) => {
    const leftCreated = String(left?.created_at || '')
    const rightCreated = String(right?.created_at || '')
    if (leftCreated === rightCreated) {
      return Number(right?.id || 0) - Number(left?.id || 0)
    }
    return rightCreated.localeCompare(leftCreated)
  })
}

function applyRealtimePayload(payload) {
  if (!appliesToStructure(payload)) return
  noteSummary.value = normalizeSummary(payload?.summary)
  if (payload?.item) {
    mergeNoteItem(payload.item)
  }
  emit('updated', noteSummary.value)
}

function startLiveUpdates() {
  if (stopRealtimeSubscription || !props.pdbCode) return
  stopRealtimeSubscription = StructureNotesRealtimeService.subscribeToStructureNotes(
    [props.pdbCode],
    applyRealtimePayload
  )
}

function stopLiveUpdates() {
  if (typeof stopRealtimeSubscription === 'function') {
    stopRealtimeSubscription()
  }
  stopRealtimeSubscription = null
}

watch(
  () => props.pdbCode,
  (value) => {
    stopLiveUpdates()
    if (normalizeCode(value)) {
      startLiveUpdates()
    }
  },
  { immediate: true }
)

function formatNoteDate(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function noteAuthor(note) {
  return note?.author?.name || note?.author?.username || note?.author?.email || 'Expert user'
}

function normalizeSourceContext() {
  if (typeof props.sourceContext === 'string' && props.sourceContext.trim()) {
    return { surface: props.sourceContext.trim() }
  }
  if (props.sourceContext && typeof props.sourceContext === 'object') {
    return props.sourceContext
  }
  return null
}

function resetForm() {
  form.value = {
    title: '',
    category: 'annotation',
    suggested_group: '',
    suggested_tm_count: null,
    comment: '',
  }
}

async function loadNotes() {
  if (!props.pdbCode) return
  loading.value = true
  error.value = ''
  try {
    const response = await StructureNotesService.listStructureNotes(props.pdbCode, { limit: 100 })
    const payload = response?.data?.data || {}
    noteSummary.value = normalizeSummary(payload?.summary)
    notes.value = Array.isArray(payload?.items) ? payload.items : []
    emit('updated', noteSummary.value)
  } catch (requestError) {
    console.error('Could not load structure expert notes:', requestError)
    error.value = requestError?.response?.data?.message || requestError?.message || 'Could not load expert notes.'
  } finally {
    loading.value = false
  }
}

async function openDialog() {
  dialog.value = true
  await loadNotes()
}

async function submitNote() {
  if (!props.pdbCode || submitting.value) return
  if (!String(form.value.comment || '').trim()) {
    error.value = 'Please add a note before submitting.'
    return
  }

  submitting.value = true
  error.value = ''
  try {
    const response = await StructureNotesService.createStructureNote(props.pdbCode, {
      title: form.value.title || null,
      category: form.value.category,
      suggested_group: form.value.suggested_group || null,
      suggested_tm_count:
        form.value.suggested_tm_count === '' || form.value.suggested_tm_count == null
          ? null
          : Number(form.value.suggested_tm_count),
      comment: form.value.comment,
      source_context: normalizeSourceContext(),
    })
    const payload = response?.data?.data || {}
    resetForm()
    applyRealtimePayload(payload)
    Swal.fire({
      title: 'Expert note saved',
      text: `A new structure note was saved for ${props.pdbCode}.`,
      icon: 'success',
      confirmButtonText: 'OK',
    })
  } catch (requestError) {
    console.error('Could not save structure expert note:', requestError)
    error.value = requestError?.response?.data?.message || requestError?.message || 'Could not save expert note.'
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => {
  stopLiveUpdates()
})
</script>

<template>
  <button
    type="button"
    class="expert-note-trigger"
    :class="{ 'expert-note-trigger--button': triggerMode === 'button' }"
    @click.stop="openDialog"
  >
    <v-icon size="18">mdi-message-text-outline</v-icon>
    <span v-if="triggerMode === 'button'" class="expert-note-trigger__label">{{ triggerLabel }}</span>
    <span class="expert-note-trigger__count">{{ displayCount }}</span>
  </button>

  <v-dialog v-model="dialog" max-width="980">
    <v-card class="expert-notes-dialog">
      <v-card-title class="expert-notes-dialog__title">
        <div>
          <div class="expert-notes-dialog__eyebrow">Expert Annotation Notes</div>
          <div class="expert-notes-dialog__heading">Structure {{ pdbCode }}</div>
        </div>
        <div class="expert-notes-dialog__stats">
          <v-chip size="small" color="primary" variant="flat">{{ displayCount }} total</v-chip>
          <v-chip size="small" color="warning" variant="flat">{{ openCount }} open</v-chip>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="expert-notes-dialog__summary">
          <div class="expert-notes-dialog__summary-label">Latest note</div>
          <div class="expert-notes-dialog__summary-value">{{ latestExcerpt }}</div>
        </div>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
          {{ error }}
        </v-alert>
        <div class="expert-notes-dialog__grid">
          <section class="expert-notes-panel expert-notes-panel--form">
            <div class="expert-notes-panel__title">Add Expert Note</div>
            <div class="expert-notes-form">
              <v-text-field v-model="form.title" label="Title (optional)" density="comfortable" variant="outlined" hide-details="auto" />
              <v-select
                v-model="form.category"
                :items="categoryItems"
                item-title="title"
                item-value="value"
                label="Category"
                density="comfortable"
                variant="outlined"
                hide-details="auto"
              />
              <div class="expert-notes-form__row">
                <v-text-field
                  v-model="form.suggested_group"
                  label="Suggested group (optional)"
                  density="comfortable"
                  variant="outlined"
                  hide-details="auto"
                />
                <v-text-field
                  v-model="form.suggested_tm_count"
                  label="Suggested TM count"
                  type="number"
                  density="comfortable"
                  variant="outlined"
                  hide-details="auto"
                />
              </div>
              <v-textarea
                v-model="form.comment"
                label="Comment or suggestion"
                auto-grow
                rows="6"
                variant="outlined"
                hide-details="auto"
              />
              <div class="expert-notes-form__actions">
                <button class="btn btn-primary btn-sm" :disabled="submitting" @click="submitNote">
                  {{ submitting ? 'Saving...' : 'Save Note' }}
                </button>
              </div>
            </div>
          </section>

          <section class="expert-notes-panel expert-notes-panel--history">
            <div class="expert-notes-panel__title">Recent Notes</div>
            <div v-if="loading" class="expert-notes-empty">Loading notes…</div>
            <div v-else-if="!notes.length" class="expert-notes-empty">
              No expert notes have been added for this structure yet.
            </div>
            <div v-else class="expert-note-list">
              <article v-for="note in notes" :key="note.id" class="expert-note-card">
                <div class="expert-note-card__meta">
                  <div class="expert-note-card__chips">
                    <v-chip size="x-small" color="primary" variant="flat">{{ note.category }}</v-chip>
                    <v-chip size="x-small" :color="note.status === 'open' ? 'warning' : 'success'" variant="flat">
                      {{ note.status }}
                    </v-chip>
                    <v-chip v-if="note.suggested_group" size="x-small" variant="outlined">
                      Group: {{ note.suggested_group }}
                    </v-chip>
                    <v-chip v-if="note.suggested_tm_count != null" size="x-small" variant="outlined">
                      TM: {{ note.suggested_tm_count }}
                    </v-chip>
                  </div>
                  <div class="expert-note-card__byline">
                    {{ noteAuthor(note) }} • {{ formatNoteDate(note.created_at) }}
                  </div>
                </div>
                <div v-if="note.title" class="expert-note-card__title">{{ note.title }}</div>
                <div class="expert-note-card__comment">{{ note.comment }}</div>
              </article>
            </div>
          </section>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <button class="btn btn-outline-primary btn-sm" @click="dialog = false">Close</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.expert-note-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(15, 76, 129, 0.16);
  border-radius: 999px;
  background: #f8fbff;
  color: #0f4c81;
  padding: 0.32rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 600;
}

.expert-note-trigger--button {
  background: linear-gradient(145deg, #ffffff, #eef6ff);
  box-shadow: 0 10px 24px rgba(15, 76, 129, 0.08);
}

.expert-note-trigger__count {
  min-width: 1.4rem;
  padding: 0.05rem 0.38rem;
  border-radius: 999px;
  background: rgba(15, 76, 129, 0.12);
  text-align: center;
}

.expert-notes-dialog__title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.expert-notes-dialog__eyebrow {
  color: #516072;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.expert-notes-dialog__heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f4c81;
}

.expert-notes-dialog__stats {
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.expert-notes-dialog__summary {
  background: linear-gradient(145deg, #f8fbff, #eef6ff);
  border: 1px solid rgba(15, 76, 129, 0.12);
  border-radius: 14px;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
}

.expert-notes-dialog__summary-label {
  color: #516072;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
}

.expert-notes-dialog__summary-value {
  color: #17324d;
}

.expert-notes-dialog__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 1rem;
}

.expert-notes-panel {
  border: 1px solid rgba(15, 76, 129, 0.12);
  border-radius: 16px;
  background: #fff;
  padding: 1rem;
}

.expert-notes-panel__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f4c81;
  margin-bottom: 0.9rem;
}

.expert-notes-form {
  display: grid;
  gap: 0.85rem;
}

.expert-notes-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 0.85rem;
}

.expert-notes-form__actions {
  display: flex;
  justify-content: flex-end;
}

.expert-note-list {
  display: grid;
  gap: 0.9rem;
  max-height: 58vh;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.expert-note-card {
  border: 1px solid rgba(15, 76, 129, 0.12);
  border-radius: 14px;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  padding: 0.9rem;
}

.expert-note-card__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.55rem;
}

.expert-note-card__chips {
  display: inline-flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.expert-note-card__byline {
  color: #516072;
  font-size: 0.82rem;
}

.expert-note-card__title {
  font-weight: 700;
  color: #17324d;
  margin-bottom: 0.35rem;
}

.expert-note-card__comment {
  color: #20364f;
  white-space: pre-wrap;
}

.expert-notes-empty {
  color: #516072;
  min-height: 120px;
  display: grid;
  place-items: center;
  text-align: center;
}

@media (max-width: 960px) {
  .expert-notes-dialog__grid,
  .expert-notes-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
