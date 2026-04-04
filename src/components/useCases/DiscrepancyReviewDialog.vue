<template>
  <div class="discrepancy-review-dialog" @click.stop>
    <v-btn
      v-if="triggerMode === 'button'"
      size="small"
      color="primary"
      variant="outlined"
      class="discrepancy-review-dialog__trigger"
      @click.stop="openDialog"
    >
      <v-icon start size="16">mdi-clipboard-check-outline</v-icon>
      {{ triggerLabel }}
    </v-btn>
    <v-btn
      v-else
      icon
      size="small"
      variant="text"
      color="primary"
      class="discrepancy-review-dialog__icon-trigger"
      @click.stop="openDialog"
    >
      <v-icon size="18">mdi-clipboard-check-outline</v-icon>
      <v-tooltip activator="parent" location="top">Formal discrepancy review</v-tooltip>
    </v-btn>

    <v-dialog v-model="dialog" max-width="860">
      <v-card class="discrepancy-review-dialog__card">
        <v-card-title class="discrepancy-review-dialog__header">
          <div>
            <div class="discrepancy-review-dialog__eyebrow">Formal Review</div>
            <div class="discrepancy-review-dialog__title">
              Discrepancy Review for {{ pdbCode }}
            </div>
          </div>
          <v-chip
            size="small"
            :color="statusChipColor(currentReview.status)"
            variant="flat"
          >
            {{ humanizeStatus(currentReview.status) }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <p class="discrepancy-review-dialog__intro">
            Use this form for formal expert adjudication. This is separate from free-text structure notes and affects review status, benchmark inclusion logic, and benchmark status.
          </p>

          <div class="discrepancy-review-dialog__current">
            <div class="discrepancy-review-dialog__current-item">
              <span class="discrepancy-review-dialog__current-label">Current status</span>
              <span class="discrepancy-review-dialog__current-value">
                {{ humanizeStatus(currentReview.status) }}
              </span>
            </div>
            <div class="discrepancy-review-dialog__current-item">
              <span class="discrepancy-review-dialog__current-label">Reviewed group</span>
              <span class="discrepancy-review-dialog__current-value">
                {{ currentReview.reviewed_group || 'Not specified' }}
              </span>
            </div>
            <div class="discrepancy-review-dialog__current-item">
              <span class="discrepancy-review-dialog__current-label">Reviewed TM count</span>
              <span class="discrepancy-review-dialog__current-value">
                {{ currentReview.reviewed_tm_count ?? 'Not specified' }}
              </span>
            </div>
            <div class="discrepancy-review-dialog__current-item">
              <span class="discrepancy-review-dialog__current-label">Last reviewed</span>
              <span class="discrepancy-review-dialog__current-value">
                {{ formatDate(currentReview.reviewed_at) }}
              </span>
            </div>
          </div>

          <v-row class="mt-2">
            <v-col cols="12" md="4">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Review status"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.reviewed_group"
                :items="groupOptions"
                label="Adjudicated group"
                variant="outlined"
                density="comfortable"
                clearable
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.reviewed_tm_count"
                label="Adjudicated TM count"
                variant="outlined"
                density="comfortable"
                type="number"
                min="0"
                clearable
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.rationale"
                label="Rationale"
                variant="outlined"
                rows="3"
                auto-grow
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.reviewer_note"
                label="Reviewer note"
                variant="outlined"
                rows="3"
                auto-grow
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="discrepancy-review-dialog__actions">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveReview">
            Save Review
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import UseCasesService from '@/services/use_cases.service'

const props = defineProps({
  pdbCode: {
    type: String,
    required: true,
  },
  initialReview: {
    type: Object,
    default: () => ({}),
  },
  triggerMode: {
    type: String,
    default: 'button',
  },
  triggerLabel: {
    type: String,
    default: 'Review',
  },
})

const emit = defineEmits(['updated'])

const dialog = ref(false)
const saving = ref(false)
const currentReview = ref(normalizeReview(props.initialReview))
const form = reactive({
  status: 'open',
  reviewed_group: null,
  reviewed_tm_count: null,
  rationale: '',
  reviewer_note: '',
})

const statusOptions = [
  { title: 'Open', value: 'open' },
  { title: 'Reviewed', value: 'reviewed' },
  { title: 'Accepted', value: 'accepted' },
  { title: 'Uncertain', value: 'uncertain' },
  { title: 'Rejected', value: 'rejected' },
]

const groupOptions = [
  'MONOTOPIC',
  'BITOPIC',
  'TRANSMEMBRANE PROTEINS: ALPHA-HELICAL',
  'TRANSMEMBRANE PROTEINS: BETA-BARREL',
]

watch(
  () => props.initialReview,
  (value) => {
    currentReview.value = normalizeReview(value)
    applyReviewToForm(currentReview.value)
  },
  { immediate: true, deep: true }
)

function normalizeReview(value = {}) {
  const review = value?.review ? value.review : value
  return {
    status: String(review?.status || 'open').trim().toLowerCase() || 'open',
    rationale: review?.rationale || '',
    reviewer_note: review?.reviewer_note || '',
    reviewed_group: review?.reviewed_group || null,
    reviewed_tm_count: review?.reviewed_tm_count ?? null,
    reviewed_at: review?.reviewed_at || null,
  }
}

function applyReviewToForm(review) {
  form.status = review?.status || 'open'
  form.reviewed_group = review?.reviewed_group || null
  form.reviewed_tm_count = review?.reviewed_tm_count ?? null
  form.rationale = review?.rationale || ''
  form.reviewer_note = review?.reviewer_note || ''
}

async function openDialog() {
  dialog.value = true
  try {
    const response = await UseCasesService.discrepancyReview(props.pdbCode)
    const candidate = response?.data?.data || null
    if (candidate?.review) {
      currentReview.value = normalizeReview(candidate.review)
      applyReviewToForm(currentReview.value)
    }
  } catch (error) {
    console.error('Discrepancy review fetch failed:', error)
  }
}

async function saveReview() {
  saving.value = true
  try {
    const payload = {
      status: form.status,
      reviewed_group: form.reviewed_group || null,
      reviewed_tm_count:
        form.reviewed_tm_count === '' || form.reviewed_tm_count == null
          ? null
          : Number(form.reviewed_tm_count),
      rationale: form.rationale || '',
      reviewer_note: form.reviewer_note || '',
    }
    const response = await UseCasesService.updateDiscrepancyReview(props.pdbCode, payload)
    const candidate = response?.data?.data || null
    currentReview.value = normalizeReview(candidate?.review || payload)
    dialog.value = false
    emit('updated', { candidate, review: currentReview.value })
  } catch (error) {
    console.error('Discrepancy review save failed:', error)
    Swal.fire({
      title: 'Save Failed',
      text: 'The discrepancy review could not be saved.',
      icon: 'error',
      confirmButtonText: 'OK',
    })
  } finally {
    saving.value = false
  }
}

function humanizeStatus(value) {
  const normalized = String(value || 'open').trim().toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function statusChipColor(value) {
  switch (String(value || 'open').trim().toLowerCase()) {
    case 'accepted':
      return 'success'
    case 'reviewed':
      return 'primary'
    case 'uncertain':
      return 'warning'
    case 'rejected':
      return 'error'
    default:
      return 'default'
  }
}

function formatDate(value) {
  if (!value) return 'Not reviewed yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not reviewed yet'
  return date.toLocaleString()
}
</script>

<style scoped>
.discrepancy-review-dialog__trigger {
  text-transform: none;
  letter-spacing: 0;
}

.discrepancy-review-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.discrepancy-review-dialog__eyebrow {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.discrepancy-review-dialog__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.discrepancy-review-dialog__intro {
  color: #475569;
  margin-bottom: 16px;
}

.discrepancy-review-dialog__current {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.discrepancy-review-dialog__current-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.discrepancy-review-dialog__current-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 4px;
}

.discrepancy-review-dialog__current-value {
  color: #0f172a;
  font-weight: 600;
  word-break: break-word;
}

.discrepancy-review-dialog__actions {
  padding: 12px 20px 18px;
}
</style>
