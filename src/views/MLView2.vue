<template>
  <div class="main-content">
    <HeaderCrumbs label="MetaMP Grouping View" title="" />

    <div class="card hero-card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
          <div>
            <h4 class="mb-2" style="color: white; font-weight: 600;">Membrane Protein Group Prediction Workspace</h4>
            <p class="text-muted mb-2">
              This workspace uses the production MetaMP supervised and semi-supervised grouping bundles.
              Training variables, exclusion lists, expert-set evaluation tables, and discrepancy-table predictions
              are exported with each training run so the workflow stays reproducible and publication ready.
            </p>
            <p class="text-muted mb-0" v-if="trainingScope">
              Discrepancy records excluded from training:
              <strong>{{ trainingScope.discrepancy_exclusion_count ?? 0 }}</strong>.
              Expert records in evaluation set:
              <strong>{{ trainingScope.expert_annotation_count ?? 0 }}</strong>.
              Leakage check:
              <strong>{{ trainingScope.confirmed_all_reserved_benchmark_codes_excluded_from_training ? 'passed' : 'failed' }}</strong>.
            </p>
          </div>
          <div class="command-box">
            <div class="text-uppercase text-muted fw-semibold mb-1">Run Command</div>
            <code>{{ commands.local || 'python3 -m src.Commands.run_ml_pipeline' }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload / template row -->
    <div class="row g-4">
      <div class="col-lg-5">
        <div class="card workspace-card shadow-sm border-0 h-100">
          <div class="card-body">
            <h5 class="mb-3">Predict Your Dataset</h5>
            <form @submit.prevent="submitPrediction">
              <div class="mb-3">
                <label class="form-label fw-semibold">Production model bundle</label>
                <select v-model="selectedArtifactId" class="form-select">
                  <option value="">Use recommended bundle</option>
                  <option
                    v-for="artifact in artifactOptions"
                    :key="artifact.artifact_id"
                    :value="artifact.artifact_id"
                  >
                    {{ artifactLabel(artifact) }}
                  </option>
                </select>
                <div class="form-text">
                  The recommended bundle is selected automatically from the held-out expert benchmark.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Upload CSV dataset</label>
                <input type="file" accept=".csv" class="form-control" @change="onFileChange" />
                <div class="form-text">Use the template below. CSV only.</div>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <button type="submit" class="btn btn-workspace-primary" :disabled="isPredicting">
                  {{ isPredicting ? 'Predicting...' : 'Predict and Download CSV' }}
                </button>
                <button type="button" class="btn btn-workspace-secondary" @click="downloadTemplate" :disabled="isDownloadingTemplate">
                  {{ isDownloadingTemplate ? 'Preparing...' : 'Download template' }}
                </button>
              </div>
            </form>

            <hr class="my-4" />

            <h6 class="mb-2">Download Real Sample Rows</h6>
            <p class="text-muted">
              Provide comma-separated PDB codes to export example rows in the required upload format.
            </p>
            <div class="mb-3">
              <label class="form-label fw-semibold">PDB codes</label>
              <input v-model="pdbCodes" type="text" class="form-control" placeholder="e.g. 1AFO, 2YMK, 6A69" />
            </div>
            <button type="button" class="btn btn-workspace-accent" @click="downloadRealSample" :disabled="isDownloadingSample">
              {{ isDownloadingSample ? 'Preparing sample...' : 'Download real sample CSV' }}
            </button>

            <div v-if="errorMessage"   class="alert alert-danger  mt-4 mb-0">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success mt-4 mb-0">{{ successMessage }}</div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="card workspace-card shadow-sm border-0 h-100">
          <div class="card-body">
            <h5 class="mb-3">Template Specification</h5>
            <div class="table-responsive">
              <table class="table table-sm align-middle">
                <thead>
                  <tr><th>Column</th><th>Required</th><th>Type</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr v-for="column in templateColumns" :key="column.name">
                    <td><code>{{ column.name }}</code></td>
                    <td>{{ column.required ? 'Yes' : 'Optional' }}</td>
                    <td>{{ column.type }}</td>
                    <td>{{ column.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h6 class="mt-4 mb-2">Sample rows</h6>
            <div class="table-responsive">
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th v-for="heading in sampleHeaders" :key="heading"><code>{{ heading }}</code></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in sampleRows" :key="index">
                    <td v-for="heading in sampleHeaders" :key="`${index}-${heading}`">{{ row[heading] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics section — ref gives us real pixel width for Vega specs -->
    <div class="row g-4 mt-5">

      <!-- Metric definitions -->
      <div class="col-12">
        <div class="card workspace-card shadow-sm border-0">
          <div class="card-body">
            <h5 class="mb-3">Target Label and Evaluation Notes</h5>
            <div class="row g-3">
              <div class="col-lg-4">
                <div class="metric-note h-100">
                  <div class="text-uppercase text-muted fw-semibold mb-2">Training Target</div>
                  <p class="mb-0 text-muted">{{ metricDefinitions.target_label_source || 'Training target Y is the standardized MPstruc group label.' }}</p>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="metric-note h-100">
                  <div class="text-uppercase text-muted fw-semibold mb-2">Expert-set Accuracy</div>
                  <p class="mb-0 text-muted">{{ metricDefinitions.expert_accuracy || 'Exact-match accuracy against the held-out expert benchmark.' }}</p>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="metric-note h-100">
                  <div class="text-uppercase text-muted fw-semibold mb-2">Expert-set Weighted F1</div>
                  <p class="mb-0 text-muted">{{ metricDefinitions.expert_f1_weighted || 'Weighted F1 against the held-out expert benchmark.' }}</p>
                </div>
              </div>
            </div>
            <p class="text-muted mt-3 mb-0">{{ metricDefinitions.tsne_note || 't-SNE is shown as an exploratory visualization only.' }}</p>
          </div>
        </div>
      </div>

      <!-- Leaderboard table -->
      <div class="col-12 mt-5">
        <div class="card workspace-card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
              <div>
                <h5 class="mb-1">Production Bundle Leaderboard</h5>
                <p class="text-muted mb-0">
                  Showing every trained bundle in the production registry, grouped by classifier.
                  {{ artifactSummary }}
                </p>
              </div>
            </div>
            <div class="classifier-tabs mb-3" v-if="classifierTabs.length">
              <button
                v-for="classifier in classifierTabs"
                :key="classifier"
                type="button"
                class="btn classifier-tab"
                :class="{ active: classifier === activeClassifier }"
                @click="activeClassifier = classifier"
              >{{ classifier }}</button>
            </div>
            <div class="table-responsive">
              <table class="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Selected</th><th>Training mode</th><th>View</th><th>Classifier</th>
                    <th>CV F1</th><th>Expert-set Weighted F1</th><th>Expert-set Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="artifact in activeClassifierRows" :key="artifact.artifact_id">
                    <td>
                      <span v-if="artifact.selected_for_upload" class="badge recommendation-badge">Recommended</span>
                      <span v-else-if="artifact.selected_for_mode" class="badge mode-badge">Best in mode</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>{{ humanizeMode(artifact.training_mode) }}</td>
                    <td>{{ artifact.reduction_key }}</td>
                    <td>{{ artifact.classifier_name }}</td>
                    <td>{{ formatMetric(artifact.cv_mean_f1) }}</td>
                    <td>{{ formatMetric(artifact.expert_f1_weighted) }}</td>
                    <td>{{ formatMetric(artifact.expert_accuracy) }}</td>
                  </tr>
                  <tr v-if="!activeClassifierRows.length">
                    <td colspan="7" class="text-muted text-center py-4">No trained production bundles found. Run the ML pipeline first.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Side-by-side performance charts -->
      <div class="col-12 mt-5">
        <div class="row g-4 align-items-stretch">

          <div class="col-xl-6 d-flex">
            <div class="card workspace-card shadow-sm border-0 h-100 w-100">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <h5 class="mb-1">Semi-supervised Performance</h5>
                  <p class="text-muted mb-0">CV F1, Expert F1, and Accuracy across no_dr / pca / umap views.</p>
                </div>
                <div class="classifier-tabs mb-3" v-if="classifierTabs.length">
                  <button
                    v-for="classifier in classifierTabs"
                    :key="`semi-${classifier}`"
                    type="button"
                    class="btn classifier-tab"
                    :class="{ active: classifier === activeSemiClassifier }"
                    @click="activeSemiClassifier = classifier"
                  >{{ classifier }}</button>
                </div>
                <div class="chart-shell flex-grow-1">
                  <PlotlyView
                    :chart-data="semiSupervisedPlot.data"
                    :layout="semiSupervisedPlot.layout"
                    :config="semiSupervisedPlot.config"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-6 d-flex">
            <div class="card workspace-card shadow-sm border-0 h-100 w-100">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <h5 class="mb-1">Supervised Performance</h5>
                  <p class="text-muted mb-0">Same structure as semi-supervised for easy side-by-side comparison.</p>
                </div>
                <div class="classifier-tabs mb-3" v-if="classifierTabs.length">
                  <button
                    v-for="classifier in classifierTabs"
                    :key="`sup-${classifier}`"
                    type="button"
                    class="btn classifier-tab"
                    :class="{ active: classifier === activeSupervisedClassifier }"
                    @click="activeSupervisedClassifier = classifier"
                  >{{ classifier }}</button>
                </div>
                <div class="chart-shell flex-grow-1">
                  <PlotlyView
                    :chart-data="supervisedPlot.data"
                    :layout="supervisedPlot.layout"
                    :config="supervisedPlot.config"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expert benchmark chart -->
      <div class="col-12 mt-5">
        <div class="card workspace-card shadow-sm border-0">
          <div class="card-body">
            <div class="mb-3">
              <h5 class="mb-1">Held-out Expert Benchmark Leaderboard</h5>
              <p class="text-muted mb-0">
                Six training-mode / view combinations per classifier, ranked by expert-set metrics.
              </p>
            </div>
            <div class="classifier-tabs mb-3" v-if="classifierTabs.length">
              <button
                v-for="classifier in classifierTabs"
                :key="`expert-${classifier}`"
                type="button"
                class="btn classifier-tab"
                :class="{ active: classifier === activeExpertClassifier }"
                @click="activeExpertClassifier = classifier"
              >{{ classifier }}</button>
            </div>
            <div class="chart-shell chart-shell--expert">
              <PlotlyView
                :chart-data="expertBenchmarkPlot.data"
                :layout="expertBenchmarkPlot.layout"
                :config="expertBenchmarkPlot.config"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Dimensionality reduction -->
      <div class="col-12 mt-5">
        <div class="card workspace-card shadow-sm border-0">
          <div class="card-body">
            <div class="mb-3">
              <h5 class="mb-1">Dimensionality Reduction Views</h5>
              <p class="text-muted mb-0">
                Exploratory separation of MetaMP records by the MPstruc broad-group target.
                Only PCA and UMAP are used for production held-out transforms.
              </p>
            </div>
            <div class="row g-4">
              <div class="col-xl-4" v-if="drCharts.pca_chart">
                <GraphView id="ml-dr-pca"   :summary="drCharts.pca_chart"   label="PCA" />
              </div>
              <div class="col-xl-4" v-if="drCharts.t_sne_chart">
                <GraphView id="ml-dr-tsne"  :summary="drCharts.t_sne_chart" label="t-SNE" />
              </div>
              <div class="col-xl-4" v-if="drCharts.umap_chart">
                <GraphView id="ml-dr-umap"  :summary="drCharts.umap_chart"  label="UMAP" />
              </div>
              <div v-if="!hasDrCharts" class="col-12 text-muted text-center py-4">
                Dimensionality-reduction charts are not available yet. Re-run the ML pipeline to regenerate PCA, t-SNE, and UMAP views.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SHAP explainability -->
      <div class="col-12 mt-5" v-if="hasExplainabilityFigures">
        <div class="card workspace-card shadow-sm border-0">
          <div class="card-body">
            <div class="mb-3">
              <h5 class="mb-1">SHAP Explainability Figures</h5>
              <p class="text-muted mb-0">
                Publication-ready feature attribution for the best biologically interpretable tree-based production bundle.
                The upload recommendation may differ when a non-tree model performs better on the held-out expert benchmark.
              </p>
            </div>

            <div class="explainability-summary mb-4" v-if="selectedTreeBundle">
              <div>
                <span class="text-uppercase text-muted fw-semibold">Bundle</span>
                <div>{{ selectedTreeBundle.classifier_name }} / {{ humanizeMode(selectedTreeBundle.training_mode) }} / {{ selectedTreeBundle.reduction_key }}</div>
              </div>
              <div>
                <span class="text-uppercase text-muted fw-semibold">Expert F1</span>
                <div>{{ formatMetric(selectedTreeBundle.expert_f1_weighted) }}</div>
              </div>
              <div>
                <span class="text-uppercase text-muted fw-semibold">Expert Accuracy</span>
                <div>{{ formatMetric(selectedTreeBundle.expert_accuracy) }}</div>
              </div>
              <div>
                <span class="text-uppercase text-muted fw-semibold">Sample Count</span>
                <div>{{ selectedTreeBundle.feature_sample_count ?? '—' }}</div>
              </div>
            </div>

            <!-- Figure grid — PNG only, PDF handled via buttons below each card -->
            <div class="row g-4">
              <div
                v-for="figure in shapFigures"
                :key="figure.filename"
                class="col-12 col-xl-6"
              >
                <div class="shap-figure-card h-100">
                  <div class="shap-figure-header mb-3">
                    <div>
                      <h6 class="mb-1">{{ readableFigureLabel(figure) }}</h6>
                      <p class="text-muted mb-0">{{ figure.filename }}</p>
                    </div>

                    <!-- Action buttons -->
                    <div class="shap-actions">
                      <!-- View PNG -->
                      <a
                        class="btn btn-workspace-secondary btn-sm shap-btn"
                        :href="artifactUrl(figure)"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View PNG"
                      >
                        <i class="bi bi-eye"></i>
                        <span class="shap-btn-label">View</span>
                      </a>

                      <!-- Download PDF: prefer backend-served; fall back to jsPDF -->
                      <a
                        v-if="pdfForFigure(figure)"
                        class="btn btn-workspace-accent btn-sm shap-btn"
                        :href="artifactUrl(pdfForFigure(figure))"
                        :download="pdfForFigure(figure).filename"
                        title="Download PDF"
                      >
                        <i class="bi bi-file-earmark-arrow-down"></i>
                        <span class="shap-btn-label">PDF</span>
                      </a>
                      <button
                        v-else
                        type="button"
                        class="btn btn-workspace-accent btn-sm shap-btn"
                        :disabled="downloadingPdf[figure.filename]"
                        :title="downloadingPdf[figure.filename] ? 'Preparing…' : 'Download PDF'"
                        @click="downloadShapAsPdf(figure)"
                      >
                        <i :class="downloadingPdf[figure.filename] ? 'bi bi-hourglass-split' : 'bi bi-file-earmark-arrow-down'"></i>
                        <span class="shap-btn-label">{{ downloadingPdf[figure.filename] ? '…' : 'PDF' }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- PNG rendered inline -->
                  <img
                    class="shap-image"
                    :src="artifactUrl(figure)"
                    :alt="readableFigureLabel(figure)"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <!-- Footer actions: CSV + bulk PDF -->
            <div class="mt-4 d-flex flex-wrap gap-3">
              <a
                v-if="shapTables.length"
                class="btn btn-workspace-accent"
                :href="artifactUrl(shapTables[0])"
                target="_blank"
                rel="noopener noreferrer"
              >Download SHAP feature-importance CSV</a>

              <!-- Bulk PDF only shown when there are multiple figures -->
              <button
                v-if="shapFigures.length > 1"
                type="button"
                class="btn btn-workspace-primary"
                :disabled="isDownloadingAllPdf"
                @click="downloadAllShapAsPdf"
              >
                {{ isDownloadingAllPdf ? 'Building PDF…' : 'Download all SHAP figures (PDF)' }}
              </button>
            </div>

          </div>
        </div>
      </div>

    </div><!-- /analytics row -->
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import GraphView from '@/components/dashboard/GraphView.vue'
import PlotlyView from '@/components/dashboard/PlotlyView.vue'
import MLWorkbenchService from '@/services/mlWorkbench.service'
import { jsPDF } from 'jspdf' 
// ─── State ────────────────────────────────────────────────────────────────────
const downloadingPdf      = ref({})   // per-figure jsPDF fallback loading state
const isDownloadingAllPdf = ref(false)

const artifactOptions            = ref([])
const charts                     = ref({ performance_comparison: null, expert_leaderboard: null })
const templateColumns            = ref([])
const sampleRows                 = ref([])
const commands                   = ref({})
const trainingScope              = ref(null)
const metricDefinitions          = ref({})
const explainability             = ref({})
const selectedArtifactId         = ref('')
const activeClassifier           = ref('')
const activeSemiClassifier       = ref('')
const activeSupervisedClassifier = ref('')
const activeExpertClassifier     = ref('')
const pdbCodes                   = ref('')
const selectedFile               = ref(null)
const errorMessage               = ref('')
const successMessage             = ref('')
const isPredicting               = ref(false)
const isDownloadingTemplate      = ref(false)
const isDownloadingSample        = ref(false)

// ─── Sort orders ──────────────────────────────────────────────────────────────

const trainingModeOrder = ['semi_supervised', 'supervised']
const reductionOrder    = ['no_dr', 'pca', 'umap']
const classifierOrder   = [
  'Decision Tree',
  'Random Forest',
  'Logistic Regression',
  'Gradient Boosting Classifier',
  'KNeighbors Classifier',
  'Gaussian NB',
  'SVM',
]

// ─── Computed ─────────────────────────────────────────────────────────────────

const sampleHeaders = computed(() => {
  if (!sampleRows.value.length) return templateColumns.value.map(c => c.name)
  return Object.keys(sampleRows.value[0])
})

const drCharts    = computed(() => charts.value?.dimensionality_reduction || {})
const hasDrCharts = computed(() => Object.keys(drCharts.value).length > 0)
// ─── SHAP computed (replace your existing shapFigures / shapTables lines) ────

// Only PNG entries go into the image grid
const shapFigures = computed(() =>
  (explainability.value?.figures || []).filter(f =>
    String(f.filename || '').toLowerCase().endsWith('.png')
  )
)

// Only PDF entries — used for direct backend-served download links
const shapPdfs = computed(() =>
  (explainability.value?.figures || []).filter(f =>
    String(f.filename || '').toLowerCase().endsWith('.pdf')
  )
)

const shapTables          = computed(() => explainability.value?.tables || [])
// const selectedTreeBundle  = computed(() => explainability.value?.selected_tree_bundle || null)
// const hasExplainabilityFigures = computed(() =>
//   explainability.value?.enabled && shapFigures.value.length > 0
// )
const selectedTreeBundle = computed(() => explainability.value?.selected_tree_bundle || null)
const hasExplainabilityFigures = computed(() => explainability.value?.enabled && shapFigures.value.length > 0)

const sortedArtifactOptions = computed(() => {
  return [...artifactOptions.value].sort((a, b) => {
    const m = trainingModeOrder.indexOf(a.training_mode) - trainingModeOrder.indexOf(b.training_mode)
    if (m !== 0) return m
    const r = reductionOrder.indexOf(a.reduction_key) - reductionOrder.indexOf(b.reduction_key)
    if (r !== 0) return r
    const c = classifierOrder.indexOf(a.classifier_name) - classifierOrder.indexOf(b.classifier_name)
    if (c !== 0) return c
    return String(a.classifier_name || '').localeCompare(String(b.classifier_name || ''))
  })
})

const classifierTabs = computed(() => {
  const unique = [...new Set(sortedArtifactOptions.value.map(i => i.classifier_name).filter(Boolean))]
  return unique.sort((a, b) => {
    const d = classifierOrder.indexOf(a) - classifierOrder.indexOf(b)
    return d !== 0 ? d : a.localeCompare(b)
  })
})

const activeClassifierRows = computed(() =>
  activeClassifier.value
    ? sortedArtifactOptions.value.filter(i => i.classifier_name === activeClassifier.value)
    : sortedArtifactOptions.value
)

const artifactSummary = computed(() => {
  if (!artifactOptions.value.length) return 'No trained bundles are available yet.'
  const modes       = new Set(artifactOptions.value.map(i => i.training_mode).filter(Boolean)).size
  const views       = new Set(artifactOptions.value.map(i => i.reduction_key).filter(Boolean)).size
  const classifiers = new Set(artifactOptions.value.map(i => i.classifier_name).filter(Boolean)).size
  return `${artifactOptions.value.length} total bundles across ${modes} training modes, ${views} views, and ${classifiers} classifiers.`
})

function scoreValue(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// ─── Plotly chart builders ────────────────────────────────────────────────────

const PLOTLY_COLORS = {
  cv: '#1f5a91',
  expert: '#d97706',
  accuracy: '#0f766e',
}

function getClassifierRows(trainingMode, classifier) {
  return sortedArtifactOptions.value.filter(
    item => item.training_mode === trainingMode && item.classifier_name === classifier
  )
}

function buildPerformancePlot(trainingMode, classifier) {
  const rows = getClassifierRows(trainingMode, classifier)
  const x = reductionOrder.filter(key => rows.some(item => item.reduction_key === key))
  const byView = new Map(rows.map(item => [item.reduction_key, item]))

  const data = [
    {
      type: 'bar',
      name: 'CV F1',
      x,
      y: x.map(view => scoreValue(byView.get(view)?.cv_mean_f1)),
      marker: { color: PLOTLY_COLORS.cv },
      hovertemplate: 'View: %{x}<br>CV F1: %{y:.3f}<extra></extra>',
    },
    {
      type: 'bar',
      name: 'Expert F1',
      x,
      y: x.map(view => scoreValue(byView.get(view)?.expert_f1_weighted)),
      marker: { color: PLOTLY_COLORS.expert },
      hovertemplate: 'View: %{x}<br>Expert F1: %{y:.3f}<extra></extra>',
    },
    {
      type: 'bar',
      name: 'Accuracy',
      x,
      y: x.map(view => scoreValue(byView.get(view)?.expert_accuracy)),
      marker: { color: PLOTLY_COLORS.accuracy },
      hovertemplate: 'View: %{x}<br>Accuracy: %{y:.3f}<extra></extra>',
    },
  ]

  return {
    data,
    layout: {
      autosize: true,
      barmode: 'group',
      template: 'plotly_white',
      margin: { l: 56, r: 20, t: 24, b: 52 },
      height: 300,
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.22,
        yanchor: 'top',
      },
      yaxis: {
        title: 'Score',
        range: [0.65, 1.0],
        tickformat: '.2f',
      },
      xaxis: {
        title: 'View',
        categoryorder: 'array',
        categoryarray: reductionOrder,
      },
      title: {
        text: classifier || '',
        x: 0.02,
        xanchor: 'left',
        font: { size: 16, color: '#123b63' },
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#ffffff',
    },
    config: {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    },
  }
}

function buildExpertBenchmarkPlot(classifier) {
  const rows = sortedArtifactOptions.value.filter(item => item.classifier_name === classifier)
  const labels = [
    'Semi Supervised / no_dr',
    'Semi Supervised / pca',
    'Semi Supervised / umap',
    'Supervised / no_dr',
    'Supervised / pca',
    'Supervised / umap',
  ]
  const byLabel = new Map(
    rows.map(item => [`${humanizeMode(item.training_mode)} / ${item.reduction_key}`, item])
  )

  const x = labels.filter(label => byLabel.has(label))
  return {
    data: [
      {
        type: 'bar',
        name: 'Expert F1',
        x,
        y: x.map(label => scoreValue(byLabel.get(label)?.expert_f1_weighted)),
        marker: { color: PLOTLY_COLORS.expert },
        hovertemplate: '%{x}<br>Expert F1: %{y:.3f}<extra></extra>',
      },
      {
        type: 'bar',
        name: 'Accuracy',
        x,
        y: x.map(label => scoreValue(byLabel.get(label)?.expert_accuracy)),
        marker: { color: PLOTLY_COLORS.accuracy },
        hovertemplate: '%{x}<br>Accuracy: %{y:.3f}<extra></extra>',
      },
    ],
    layout: {
      autosize: true,
      barmode: 'group',
      template: 'plotly_white',
      margin: { l: 56, r: 20, t: 24, b: 88 },
      height: 320,
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.24,
        yanchor: 'top',
      },
      yaxis: {
        title: 'Score',
        range: [0.65, 1.0],
        tickformat: '.2f',
      },
      xaxis: {
        title: 'Training mode / view',
        tickangle: -25,
      },
      title: {
        text: classifier || '',
        x: 0.02,
        xanchor: 'left',
        font: { size: 16, color: '#123b63' },
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#ffffff',
    },
    config: {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    },
  }
}

const semiSupervisedPlot = computed(() => buildPerformancePlot('semi_supervised', activeSemiClassifier.value))
const supervisedPlot = computed(() => buildPerformancePlot('supervised', activeSupervisedClassifier.value))
const expertBenchmarkPlot = computed(() => buildExpertBenchmarkPlot(activeExpertClassifier.value))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resetMessages() { errorMessage.value = ''; successMessage.value = '' }

function humanizeMode(value) {
  return String(value || '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatMetric(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(3) : value
}

function artifactLabel(artifact) {
  const prefix = artifact?.selected_for_upload ? 'Recommended: ' : ''
  return `${prefix}${humanizeMode(artifact.training_mode)} / ${artifact.reduction_key} / ${artifact.classifier_name}`
}

function artifactUrl(artifact) {
  return MLWorkbenchService.assetUrl(artifact?.endpoint || '')
}

function readableFigureLabel(figure) {
  const name = String(figure?.filename || '')
  if (name.includes('_shap_bar')) return 'Global SHAP feature importance'
  if (name.includes('_shap_beeswarm_')) {
    const classLabel = name
      .split('_shap_beeswarm_')[1]
      ?.replace(/\.(png|pdf)$/i, '')   // ← handles both extensions
      ?.replaceAll('_', ' ')
    return `SHAP beeswarm: ${classLabel}`
  }
  return figure?.label || 'SHAP figure'
}

function downloadBlob(blob, filename) {
  const url  = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  link.remove()
}

function onFileChange(event) { selectedFile.value = event.target.files?.[0] || null }

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadWorkspace() {
  const response = await MLWorkbenchService.summary()
  const payload  = response?.data?.data || {}

  artifactOptions.value    = payload.artifacts || []
  templateColumns.value    = payload.template?.columns || []
  sampleRows.value         = payload.template?.sample_rows || []
  charts.value             = payload.charts || charts.value
  commands.value           = payload.commands || {}
  trainingScope.value      = payload.training_scope || null
  metricDefinitions.value  = payload.metric_definitions || {}
  explainability.value     = payload.explainability || {}
  selectedArtifactId.value = payload.selected_upload_artifact_id || ''

  const first = classifierTabs.value[0] || ''
  if (!classifierTabs.value.includes(activeClassifier.value))           activeClassifier.value           = first
  if (!classifierTabs.value.includes(activeSemiClassifier.value))       activeSemiClassifier.value       = first
  if (!classifierTabs.value.includes(activeSupervisedClassifier.value)) activeSupervisedClassifier.value = first
  if (!classifierTabs.value.includes(activeExpertClassifier.value))     activeExpertClassifier.value     = first
}

// ─── Actions ──────────────────────────────────────────────────────────────────

async function downloadTemplate() {
  resetMessages(); isDownloadingTemplate.value = true
  try {
    const r = await MLWorkbenchService.downloadTemplate()
    downloadBlob(r.data, 'MetaMP_ML_Template.csv')
    successMessage.value = 'Template downloaded successfully.'
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || 'Template download failed.'
  } finally { isDownloadingTemplate.value = false }
}

async function downloadRealSample() {
  resetMessages()
  if (!pdbCodes.value.trim()) { errorMessage.value = 'Enter at least one PDB code.'; return }
  isDownloadingSample.value = true
  try {
    const fd = new FormData(); fd.append('pdb_codes', pdbCodes.value)
    const r  = await MLWorkbenchService.downloadRealSample(fd)
    downloadBlob(r.data, 'MetaMP_Real_Sample_Data.csv')
    successMessage.value = 'Real sample CSV downloaded successfully.'
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || 'Real sample download failed.'
  } finally { isDownloadingSample.value = false }
}

async function submitPrediction() {
  resetMessages()
  if (!selectedFile.value) { errorMessage.value = 'Choose a CSV file first.'; return }
  isPredicting.value = true
  try {
    const fd = new FormData()
    fd.append('data_file', selectedFile.value)
    if (selectedArtifactId.value) fd.append('artifact_id', selectedArtifactId.value)
    const r    = await MLWorkbenchService.predict(fd)
    const name = selectedArtifactId.value || 'recommended_bundle'
    downloadBlob(r.data, `MetaMP_Group_Predictions_${name}.csv`)
    successMessage.value = 'Prediction completed. The CSV download has started.'
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || 'Prediction failed.'
  } finally { isPredicting.value = false }
}


// ─── SHAP PDF helpers ─────────────────────────────────────────────────────────

/**
 * Finds the matching backend-served PDF for a given PNG figure, if one exists.
 */
function pdfForFigure(figure) {
  const baseName = String(figure.filename || '').replace(/\.png$/i, '')
  return shapPdfs.value.find(p =>
    String(p.filename || '').startsWith(baseName)
  ) || null
}

/**
 * Fetches a PNG URL and returns a data-URL (handles cross-origin via fetch).
 */
async function loadImageAsDataUrl(url) {
  const response = await fetch(url)
  const blob     = await response.blob()
  return new Promise((resolve, reject) => {
    const reader   = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Returns the natural pixel dimensions of an image data-URL.
 */
function getImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img   = new Image()
    img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = reject
    img.src     = dataUrl
  })
}

/**
 * Builds a jsPDF document with one figure per A4 landscape page.
 */
async function buildPdfForImages(figures) {
  const { jsPDF } = await import('jspdf')
  const PAGE_W = 297
  const PAGE_H = 210
  const MARGIN = 12
  const TITLE_H = 10

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  for (let i = 0; i < figures.length; i++) {
    const figure  = figures[i]
    const dataUrl = await loadImageAsDataUrl(artifactUrl(figure))
    const { w, h } = await getImageDimensions(dataUrl)

    if (i > 0) doc.addPage()

    doc.setFontSize(11)
    doc.setTextColor(18, 59, 99)
    doc.text(readableFigureLabel(figure), MARGIN, MARGIN)
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(figure.filename, MARGIN, MARGIN + 5)

    const availW = PAGE_W - MARGIN * 2
    const availH = PAGE_H - MARGIN - TITLE_H
    const scale  = Math.min(availW / (w * 0.264583), availH / (h * 0.264583))
    const imgW   = w * 0.264583 * scale
    const imgH   = h * 0.264583 * scale
    const x      = MARGIN + (availW - imgW) / 2
    const y      = MARGIN + TITLE_H

    doc.addImage(dataUrl, 'PNG', x, y, imgW, imgH)
  }

  return doc
}


// ─── SHAP PDF actions ─────────────────────────────────────────────────────────

async function downloadShapAsPdf(figure) {
  downloadingPdf.value[figure.filename] = true
  try {
    const doc     = await buildPdfForImages([figure])
    const pdfName = figure.filename.replace(/\.png$/i, '') + '.pdf'
    doc.save(pdfName)
  } catch (e) {
    console.error('SHAP PDF export failed', e)
    errorMessage.value = 'PDF export failed. Please try again.'
  } finally {
    downloadingPdf.value[figure.filename] = false
  }
}

async function downloadAllShapAsPdf() {
  isDownloadingAllPdf.value = true
  try {
    const doc = await buildPdfForImages(shapFigures.value)
    doc.save('MetaMP_SHAP_Figures.pdf')
  } catch (e) {
    console.error('SHAP all-figures PDF export failed', e)
    errorMessage.value = 'PDF export failed. Please try again.'
  } finally {
    isDownloadingAllPdf.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    await loadWorkspace()
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || 'ML workspace could not be loaded.'
  }
})
</script>

<style scoped>
.main-content {
  --workspace-navy:  #123b63;
  --workspace-teal:  #0f766e;
  --workspace-orange:#d97706;
  --workspace-cream: #fffaf2;
  --workspace-border:#d8e1ea;
}

.hero-card {
  background:
    linear-gradient(135deg, rgba(0, 94, 184, 0.75) 0%, rgba(0, 71, 130, 0.60) 100%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #fff;
}
.hero-card .text-muted { color: rgba(255, 255, 255, 0.78) !important; }

.workspace-card {
  border: 1px solid var(--workspace-border);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.command-box {
  min-width: 280px;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
}
.command-box code { display: block; white-space: pre-wrap; word-break: break-word; color: #fff; }

.metric-note {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--workspace-border);
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.btn-workspace-primary,
.btn-workspace-secondary,
.btn-workspace-accent {
  border-radius: 999px;
  padding: 0.65rem 1.1rem;
  font-weight: 600;
  border-width: 1px;
}
.btn-workspace-primary           { background: var(--workspace-navy);  border-color: var(--workspace-navy);  color: #fff; }
.btn-workspace-primary:hover     { background: #0e3152;                 border-color: #0e3152;                 color: #fff; }
.btn-workspace-secondary         { background: #fff;                    border-color: var(--workspace-border); color: var(--workspace-navy); }
.btn-workspace-secondary:hover   { background: #f7fafc;                 border-color: #b9c7d4;                 color: var(--workspace-navy); }
.btn-workspace-accent            { background: var(--workspace-cream);  border-color: #f3c98b;                 color: var(--workspace-orange); }
.btn-workspace-accent:hover      { background: #fff2dc;                 border-color: #eab86c;                 color: #b95f00; }

.recommendation-badge { background: #d9f99d; color: #365314; }
.mode-badge           { background: #dbeafe; color: #1d4ed8; }

.classifier-tabs { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.classifier-tab {
  border-radius: 999px;
  border: 1px solid var(--workspace-border);
  background: #fff;
  color: var(--workspace-navy);
  font-weight: 600;
  padding: 0.55rem 0.95rem;
}
.classifier-tab:hover  { border-color: #9db5cc; background: #f8fbff; }
.classifier-tab.active { background: var(--workspace-navy); border-color: var(--workspace-navy); color: #fff; }

/* ── Chart shells ─────────────────────────────────────────────────────────── */
.chart-shell {
  width:    100%;
  display:  block;
  overflow: hidden;
  min-height: 320px;
}
.chart-shell--expert { min-height: 360px; }

.chart-shell :deep(.js-plotly-plot),
.chart-shell :deep(.plot-container),
.chart-shell :deep(.svg-container) {
  width: 100% !important;
}

.explainability-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--workspace-border);
  border-radius: 0.9rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.shap-figure-card {
  border: 1px solid var(--workspace-border);
  border-radius: 0.9rem;
  background: #fff;
  padding: 1rem;
}

.shap-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0.75rem;
  border: 1px solid #edf2f7;
  background: #fff;
}


/* ── SHAP figure card header ──────────────────────────────────────────────── */
.shap-figure-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;          /* wraps buttons below title on very narrow cards */
}

.shap-figure-header > div:first-child {
  min-width: 0;             /* allows long filenames to truncate instead of push */
  flex: 1 1 0;
}

.shap-figure-header h6 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shap-figure-header p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* ── SHAP action buttons ──────────────────────────────────────────────────── */
.shap-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: center;
  flex-wrap: nowrap;        /* buttons stay on one row */
}

.shap-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  white-space: nowrap;
  border-radius: 999px;
}

.shap-btn i {
  font-size: 0.95rem;
  line-height: 1;
}

/* On very small screens, hide the text label and show icon only */
@media (max-width: 400px) {
  .shap-btn-label {
    display: none;
  }
  .shap-btn {
    padding: 0.4rem 0.55rem;
  }
}
</style>
