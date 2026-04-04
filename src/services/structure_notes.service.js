import AxiosCall from "../config/AxiosConf";

class StructureNotesService {
  listStructureNotes(pdbCode, params = {}) {
    const query = new URLSearchParams(params).toString()
    return AxiosCall({
      method: 'GET',
      path: `structure-expert-notes/${encodeURIComponent(pdbCode)}${query ? `?${query}` : ''}`
    }, 'Bearer')
  }

  createStructureNote(pdbCode, data) {
    return AxiosCall({
      method: 'POST',
      path: `structure-expert-notes/${encodeURIComponent(pdbCode)}`,
      data
    }, 'Bearer')
  }
}

export default new StructureNotesService();
