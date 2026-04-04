<template>
  <div class="container-fluid">
    <HeaderCrumbs
      :label="'Single view for ' + searchType.toUpperCase() + ' with accession code: ' + searchQuery"
      title=""
    />
    <div v-if="viewerNotice" class="alert alert-warning mt-0 mb-3" role="alert">
        {{ viewerNotice }}
    </div>
    <div class="row viewer-row">
      <!-- Options Panel -->
      <div class="col-lg-2 col-md-2 col-12 mb-0 p-1 d-flex">
        <aside class="options-panel border rounded p-3 shadow-sm">
          <h3 class="text-primary mb-3">Viewer Options</h3>
          <!-- Search Section -->
          <fieldset class="mb-4">
            <div class="mb-3">
              <label class="form-label">Search Type:</label>
              <select v-model="searchType" class="form-select form-control">
                <option value="pdb">PDB</option>
              </select>
            </div>
            <div>
              <label class="form-label">Search Query:</label>
              <input
                v-model="searchQuery"
                class="form-control"
                :placeholder="
                  searchType === 'cif'
                    ? 'Enter .cif file name (e.g., AF-O15552-F1-model_v1.cif)'
                    : 'Enter ID (e.g., 1CBS, P12345)'
                "
              />
            </div>
          </fieldset>

          <fieldset class="mb-4">
            <legend class="text-info small" style="font-size: 12pt !important">
              Background Color
            </legend>
            <div class="d-flex align-items-center gap-2 mb-2">
              <input
                type="color"
                :value="rgbToHex(opts.bgColor)"
                @input="hexToRgb($event.target.value, opts.bgColor)"
                class="form-control form-control-color"
                style="width: 40px; height: 34px; padding: 2px; cursor: pointer"
                title="Pick background colour"
              />
              <span class="text-muted small">
                rgb({{ opts.bgColor.r }}, {{ opts.bgColor.g }}, {{ opts.bgColor.b }})
              </span>
            </div>
            <div class="row g-1">
              <div class="col-12">
                <label class="form-label mb-0 small">R {{ opts.bgColor.r }}</label>
                <input type="range" v-model.number="opts.bgColor.r" min="0" max="255" class="form-range" />
              </div>
              <div class="col-12">
                <label class="form-label mb-0 small">G {{ opts.bgColor.g }}</label>
                <input type="range" v-model.number="opts.bgColor.g" min="0" max="255" class="form-range" />
              </div>
              <div class="col-12">
                <label class="form-label mb-0 small">B {{ opts.bgColor.b }}</label>
                <input type="range" v-model.number="opts.bgColor.b" min="0" max="255" class="form-range" />
              </div>
            </div>
          </fieldset>
          
          <div class="form-check mb-3">
            <input
              type="checkbox"
              v-model="opts.membraneOrientation"
              class="form-check-input"
              id="membraneOrientation"
            />
            <label for="membraneOrientation" class="form-check-label">
              Show Membrane Orientation
            </label>
          </div>

          <div class="form-check mb-3" v-if="!opts.membraneOrientation">
            <input
              type="checkbox"
              v-model="opts.sequencePanel"
              class="form-check-input"
              id="sequencePanel"
            />
            <label for="sequencePanel" class="form-check-label">Show Sequence Panel</label>
          </div>
        </aside>
      </div>

      <!-- Viewer Container -->
      <div class="col-lg-10 col-md-10 col-12 p-1">
        <div class="viewer-panel border rounded shadow-sm">
          <div :class="['viewer-shell', opts.landscape ? 'viewer-shell--landscape' : 'viewer-shell--portrait']">
            <div v-if="viewerLoading" class="viewer-loading-overlay">
              <div class="viewer-spinner"></div>
              <p class="viewer-loading-text">Loading 3D protein structure...</p>
            </div>
            
            <StructureViewer
              v-if="activeViewerKind === 'tm' && viewerPdbId"
              :key="activeViewerRenderKey"
              :pdb-id="viewerPdbId"
              :membrane-orientation="opts.membraneOrientation"
              :side1="opts.side1"
              :bg-color="opts.bgColor"
              :sequence-panel="opts.sequencePanel"
              :landscape="opts.landscape"
              class="molstar-container border rounded shadow-sm"
              @loaded="handleTmLoaded"
              @error="handleTmError"
              @fallback-needed="handleTmFallback"
            />
            <GenericStructureViewer
              v-else
              :key="activeViewerRenderKey"
              :pdb-id="viewerPdbId"
              :bg-color="opts.bgColor"
              :sequence-panel="opts.sequencePanel"
              :landscape="opts.landscape"
              class="molstar-container border rounded shadow-sm"
              @loaded="handleGenericLoaded"
              @error="handleGenericError"
            />
          </div>
        </div>
      </div>
    </div>


    <!-- ── 0. Error banner ──────────────────────────────────────── -->
    <Transition name="fade-in">
    <!-- 0. Error banner -->
    <div v-if="error" class="row mt-2">
      <div class="col-12">
        <div class="error-banner" role="alert">
          ⚠️ Could not load record
          <p>{{ error?.message ?? 'An unexpected error occurred. Please try a different accession or refresh the page.' }}</p>
        </div>
      </div>
    </div>

    <!-- 1. Empty / no-query state -->
    <div v-else-if="hasNoQuery" class="row mt-2">
      <div class="col-12">
        <div class="details-card empty-state">
          <div class="empty-state-icon">🔬</div>
          <h3>No structure selected</h3>
          <p>Enter a PDB code, UniProt accession, or OPM ID above to load a structure record.</p>
        </div>
      </div>
    </div>
    <!-- ── 2. Skeleton while loading ────────────────────────────── -->
      <div v-else-if="isPageLoading" class="row details-row" aria-busy="true" aria-label="Loading structure record">
        <div class="col-12 p-1">
          <div class="details-layout">

            <!-- Main column skeletons -->
            <div class="details-main-column">

              <!-- Hero card -->
              <section class="details-card details-hero">
                <div class="details-heroheader">
                  <div style="flex:1">
                    <div class="skeleton skeleton-eyebrow" style="width:80px; margin-bottom:8px"></div>
                    <div class="skeleton skeleton-title" style="width:65%; height:1.8em; margin-bottom:10px"></div>
                    <div class="skeleton skeleton-text w-80"></div>
                  </div>
                </div>
                <div class="chip-list" style="margin-top:14px">
                  <div class="skeleton skeleton-chip" style="width:110px"></div>
                  <div class="skeleton skeleton-chip" style="width:80px"></div>
                  <div class="skeleton skeleton-chip" style="width:140px"></div>
                </div>
                <div class="skeleton-grid">
                  <div v-for="n in 4" :key="n" class="skeleton-grid-item">
                    <div class="skeleton skeleton-text w-40"></div>
                    <div class="skeleton skeleton-text w-60"></div>
                  </div>
                </div>
              </section>

              <!-- DB tabs card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:110px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:45%"></div>
                <!-- Tab strip -->
                <div style="display:flex; gap:8px; margin-top:16px; border-bottom:2px solid #e2e8f0; padding-bottom:4px">
                  <div v-for="n in 4" :key="n" class="skeleton skeleton-chip" style="width:72px; height:32px; border-radius:6px"></div>
                </div>
                <!-- Table rows -->
                <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
                  <div v-for="n in 8" :key="n" style="display:flex; gap:16px">
                    <div class="skeleton skeleton-text" style="width:30%"></div>
                    <div class="skeleton skeleton-text" style="width:55%"></div>
                  </div>
                </div>
              </section>

              <!-- Sequence card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:70px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:40%"></div>
                <div class="skeleton-grid" style="margin-top:16px">
                  <div v-for="n in 2" :key="n" class="skeleton-grid-item">
                    <div class="skeleton skeleton-text w-40"></div>
                    <div class="skeleton skeleton-text w-60"></div>
                  </div>
                </div>
                <div class="skeleton skeleton-block" style="margin-top:12px; height:80px"></div>
              </section>

              <!-- TM tracks card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:90px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:55%"></div>
                <div class="skeleton skeleton-block" style="margin-top:16px; height:200px"></div>
              </section>

              <!-- Function card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:70px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:42%"></div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px">
                  <div v-for="n in 3" :key="n" class="skeleton skeleton-block" style="height:56px"></div>
                </div>
              </section>
            </div><!-- /main column -->

            <!-- Side column skeletons -->
            <aside class="details-side-column">

              <!-- Preferred membrane call -->
              <section class="details-card details-card--emphasis">
                <div class="skeleton skeleton-eyebrow" style="width:80px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:70%"></div>
                <div class="tm-summary-lead" style="margin-top:14px">
                  <div class="skeleton" style="width:88px; height:88px; border-radius:20px"></div>
                  <div style="flex:1; display:flex; flex-direction:column; gap:8px">
                    <div class="skeleton skeleton-text w-80"></div>
                    <div class="skeleton skeleton-text w-60"></div>
                    <div class="skeleton skeleton-text w-full"></div>
                  </div>
                </div>
                <div class="skeleton-grid" style="margin-top:14px">
                  <div v-for="n in 4" :key="n" class="skeleton-grid-item">
                    <div class="skeleton skeleton-text w-40"></div>
                    <div class="skeleton skeleton-text w-60"></div>
                  </div>
                </div>
              </section>

              <!-- Comparison card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:90px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:50%"></div>
                <div style="margin-top:14px; display:flex; flex-direction:column; gap:8px">
                  <div v-for="n in 5" :key="n" style="display:flex; gap:12px">
                    <div class="skeleton skeleton-text" style="width:28%"></div>
                    <div class="skeleton skeleton-text" style="width:50%"></div>
                  </div>
                </div>
              </section>

              <!-- Assessment card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:80px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:55%"></div>
                <div class="skeleton skeleton-block" style="margin-top:14px; height:52px"></div>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px">
                  <div v-for="n in 4" :key="n" class="skeleton skeleton-text w-80"></div>
                </div>
              </section>

              <!-- Context links card -->
              <section class="details-card">
                <div class="skeleton skeleton-eyebrow" style="width:70px; margin-bottom:8px"></div>
                <div class="skeleton skeleton-title" style="width:40%"></div>
                <div class="chip-list" style="margin-top:14px">
                  <div v-for="n in 5" :key="n" class="skeleton skeleton-badge"></div>
                </div>
              </section>

            </aside><!-- /side column -->
          </div>
        </div>
      </div>
      <div v-else class="row details-row">
        <div class="col-12 p-1">
          <div class="details-layout">
            <div class="details-main-column">
              <section class="details-card details-hero">
                <div class="details-hero__header">
                  <div>
                    <p class="section-eyebrow">Structure record</p>
                    <h2 class="details-title">{{ displayTitle }}</h2>
                    <p v-if="displaySubtitle" class="details-subtitle">{{ displaySubtitle }}</p>
                  </div>
                  <div class="details-hero__links">
                    <span class="pill-badge">{{ searchType.toUpperCase() }} {{ searchQuery.toUpperCase() }}</span>
                    <a
                      v-if="details?.uniprot_id"
                      :href="'https://www.uniprot.org/uniprotkb/' + details?.uniprot_id + '/entry'"
                      class="pill-link"
                      target="_blank"
                      rel="noopener"
                    >
                      UniProt {{ details.uniprot_id }}
                    </a>
                  </div>
                </div>
                <div v-if="heroChips.length" class="chip-list">
                  <span v-for="chip in heroChips" :key="chip" class="meta-chip">{{ chip }}</span>
                </div>
                <div v-if="overviewRows.length" class="overview-grid">
                  <div v-for="item in overviewRows" :key="item.label" class="overview-item">
                    <span class="overview-label">{{ item.label }}</span>
                    <span class="overview-value">{{ (item.value && !Array.isArray(item.value)) ? item.value : item.value[0] }}</span>
                  </div>
                </div>
              </section>
              
              

              <!-- ===== 4-TAB DATABASE SECTION ===== -->
              <section v-if="dbTabsAvailable.length" class="details-card db-tabs-section">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Source Databases</p>
                    <h3 class="section-title">Database Records</h3>
                  </div>
                </div>

                <div class="db-tabs__nav" role="tablist">
                  <button
                    v-for="tab in dbTabsAvailable"
                    :key="tab.key"
                    :class="['db-tabs__tab', { 'db-tabs__tab--active': activeDbTab === tab.key }]"
                    :style="{ '--tab-color': tab.color }"
                    @click="activeDbTab = tab.key"
                    role="tab"
                  >
                    <span class="db-tabs__badge" :style="{ background: tab.color + '22', color: tab.color }">
                      {{ tab.badge }}
                    </span>
                    {{ tab.label }}
                  </button>
                </div>

                <div class="db-tabs__body">
                  <template v-for="tab in dbTabsAvailable" :key="tab.key">
                    <table class="db-table" v-show="activeDbTab === tab.key">
                      <tbody>
                        <tr
                          v-for="item in tab.rows"
                          :key="item.label"
                          class="db-table__row"
                        >
                          <template v-if="item.value && item.value != 'NaN' && item.value != '[]'">
                          <td class="db-table__label">{{ item.label }}</td>

                          <!-- Special cell for MPstruc Related PDB Entries -->
                          <td
                            v-if="tab.key === 'mpstruc' && item.label === 'Related PDB Entries' && parseRelatedPdbValue(item.value).length > 0"
                            class="db-table__value"
                          >
                            <div class="related-provider-row">
                              <div
                                v-for="provider in relatedProviders"
                                :key="provider.key"
                                class="related-provider-wrapper"
                                @mouseenter="openProviderDropdown(provider.key)"
                                @mouseleave="closeProviderDropdown(provider.key)"
                              >
                                <!-- Provider pill -->
                                <button class="meta-chip related-provider-chip" type="button">
                                  {{ provider.label }}
                                </button>

                                <!-- Dropdown listing all PDB codes for this provider -->
                                <div
                                  v-if="openProvider === provider.key"
                                  class="related-provider-dropdown"
                                >
                                  <button
                                    v-for="code in parseRelatedPdbValue(item.value)"
                                    :key="code"
                                    type="button"
                                    class="related-provider-dropdown__item"
                                    @click="openInNewTab(buildProviderUrl(provider.key, code))"
                                  >
                                    <span class="related-provider-dropdown__code">{{ code }}</span>
                                    <!-- <span class="related-provider-dropdown__url">
                                      {{ buildProviderUrl(provider.key, code) }}
                                    </span> -->
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <!-- Default cell for all other rows -->
                          <td v-else class="db-table__value">
                            {{ item.value }}
                          </td>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                </div>
              </section>
              <!-- ===== END 4-TAB DATABASE SECTION ===== -->



              <section v-if="coreTaxonomyRows.length || taxonomyTree.length" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Biology</p>
                    <h3 class="section-title">Taxonomy</h3>
                  </div>
                </div>
                <div v-if="coreTaxonomyRows.length" class="definition-grid">
                  <div v-for="item in coreTaxonomyRows" :key="item.label" class="definition-item">
                    <span class="definition-label">{{ item.label }}</span>
                    <span class="definition-value">{{ item.value }}</span>
                  </div>
                </div>
                <div v-if="taxonomyTree.length" class="taxonomy-tree">
                  <v-treeview
                    :items="taxonomyTree"
                    item-title="label"
                    item-children="children"
                    open-all
                    density="comfortable"
                    max-width="1200"
                  />
                </div>
              </section>

              <section v-if="sequenceInfoRows.length || hasMeaningfulValue(details?.sequence_sequence)" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Sequence</p>
                    <h3 class="section-title">Protein Sequence</h3>
                  </div>
                </div>
                <div v-if="sequenceInfoRows.length" class="definition-grid">
                  <div v-for="item in sequenceInfoRows" :key="item.label" class="definition-item">
                    <span class="definition-label">{{ item.label }}</span>
                    <span class="definition-value">{{ item.value }}</span>
                  </div>
                </div>
                <div v-if="hasMeaningfulValue(details?.sequence_sequence)" class="sequence-block">
                  <div class="definition-label">Sequence</div>
                  <ExpandableText :text="details?.sequence_sequence || ''" :limit="500" mode="chars" />
                </div>
              </section>
              <section v-if="functionalRows.length" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Function</p>
                    <h3 class="section-title">Biological Context</h3>
                  </div>
                </div>
                <div class="function-list">
                  <div v-for="item in functionalRows" :key="item.label" class="function-item">
                    <div class="definition-label">{{ item.label }}</div>
                    <ExpandableText :text="item.value" :limit="140" />
                  </div>
                </div>
              </section>

              <section v-if="tmBoundaryPlotTracks.length" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Topology</p>
                    <h3 class="section-title">TM Segment Comparison Tracks</h3>
                  </div>
                </div>
                <!-- <p class="details-subtitle">
                  OPM reference segments and all available normalized predictor outputs are aligned on the same residue axis for direct visual comparison.
                </p> -->
                <TopologyTrackPlot
                  :tracks="tmBoundaryPlotTracks"
                  :sequence-length="tmBoundarySequenceLength"
                  title="Reference and predictor topology tracks"
                />
              </section>
            </div>

            <aside class="details-side-column">
              <section v-if="tmPredictionSummary.available" class="details-card details-card--emphasis">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Topology</p>
                    <h3 class="section-title">Preferred Membrane Call</h3>
                  </div>
                </div>
                <div class="tm-summary-lead">
                  <div class="tm-summary-count">
                    {{ tmPredictionSummary.preferred_tm_count ?? '—' }}
                  </div>
                  <div class="tm-summary-body">
                    <div class="tm-summary-title">
                      {{
                        tmPredictionSummary.preferred_compact_label
                        || tmPredictionSummary.preferred_topology_label
                        || 'Normalized topology summary available'
                      }}
                    </div>
                    <div v-if="preferredDerivedTopology.chain_summary" class="tm-summary-description">
                      {{ preferredDerivedTopology.chain_summary }}
                    </div>
                  </div>
                </div>
                <div v-if="tmSummaryHighlights.length" class="definition-grid tm-summary-grid">
                  <div v-for="item in tmSummaryHighlights" :key="item.label" class="definition-item">
                    <span class="definition-label">{{ item.label }}</span>
                    <span class="definition-value">{{ item.value }}</span>
                  </div>
                </div>
                <div v-if="tmSummaryFlags.length" class="warning-chip-list mt-3">
                  <span v-for="flag in tmSummaryFlags" :key="flag" class="meta-chip meta-chip--warning">
                    {{ flag }}
                  </span>
                </div>
                <!-- <div v-if="topologyTrackItems.length" class="topology-track">
                  <div
                    v-for="(item, index) in topologyTrackItems"
                    :key="`${item.label}-${index}`"
                    class="topology-track__item"
                    :class="`topology-track__item--${item.kind}`"
                  >
                    <div class="topology-track__label">{{ item.label }}</div>
                    <div class="topology-track__range">{{ item.range }}</div>
                  </div>
                </div> -->
                <div v-if="topologyTrackItems.length" class="topology-track">
                  <div
                    v-for="(item, index) in topologyTrackItems.slice(0, visibleTrackCount)"
                    :key="`${item.label}-${index}`"
                    class="topology-track__item"
                    :class="`topology-track__item--${item.kind}`"
                  >
                    <div class="topology-track__label">{{ item.label }}</div>
                    <div class="topology-track__range">{{ item.range }}</div>
                  </div>

                  <!-- pagination controls -->
                  <div v-if="topologyTrackItems.length > TRACK_PAGE_SIZE" class="topology-track__pagination">
                    <button
                      v-if="visibleTrackCount < topologyTrackItems.length"
                      class="meta-chip"
                      style="cursor:pointer; border:none;"
                      @click="visibleTrackCount = Math.min(visibleTrackCount + TRACK_PAGE_SIZE, topologyTrackItems.length)"
                    >
                      Show next {{ Math.min(TRACK_PAGE_SIZE, topologyTrackItems.length - visibleTrackCount) }}
                    </button>
                    <button
                      v-if="visibleTrackCount > TRACK_PAGE_SIZE"
                      class="meta-chip"
                      style="cursor:pointer; border:none;"
                      @click="visibleTrackCount = TRACK_PAGE_SIZE"
                    >
                      Show less
                    </button>
                  </div>
                </div>
                <div v-if="tmSupportingMethodChips.length" class="chip-list mt-3">
                  <span v-for="chip in tmSupportingMethodChips" :key="chip" class="meta-chip text-sm" style="font-size:xx-small!important">
                    {{ chip }}
                  </span>
                </div>
                <div v-if="tmInterpretationNotes.length" class="stacked-definition-list stacked-definition-list--tight mt-3">
                  <div
                    v-for="(note, index) in tmInterpretationNotes"
                    :key="`${note}-${index}`"
                    class="stacked-definition"
                  >
                    <span class="stacked-definition__value">{{ note }}</span>
                  </div>
                </div>
              </section>

              <section
                v-if="groupComparisonRows.length || tmSegmentComparisonRows.length"
                class="details-card"
              >
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Comparison</p>
                    <h3 class="section-title">Groups & TM Segments</h3>
                  </div>
                </div>
                <div v-if="groupComparisonRows.length" class="subsection-block subsection-block--flush">
                  <div class="definition-label">Broad Group Assignment</div>
                  <div class="table-responsive mt-2">
                    <table class="table table-sm comparison-table mb-0">
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Group</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in groupComparisonRows" :key="item.source">
                          <td>{{ item.source }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="tmSegmentComparisonRows.length" class="subsection-block">
                  <div class="definition-label">TM Segment Counts</div>
                  <div class="table-responsive mt-2">
                    <table class="table table-sm comparison-table mb-0">
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Segments</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in tmSegmentComparisonRows" :key="item.source">
                          <td>{{ item.source }}</td>
                          <td>{{ item.value }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- <div v-if="tmSegmentNote" class="comparison-note">
                    {{ tmSegmentNote }}
                  </div> -->
                </div>
              </section>

              <section class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Assessment</p>
                    <h3 class="section-title">Interpretation Notes</h3>
                  </div>
                </div>
                <div class="assessment-summary" :class="{ 'assessment-summary--caution': scientificAssessmentHighlight.isCaution }">
                  {{ scientificAssessmentHighlight.message }}
                </div>
                <div v-if="benchmarkContext.cautionary_note" class="soft-alert mt-3">
                  {{ benchmarkContext.cautionary_note }}
                </div>
                <div v-if="scientificAssessmentRowsDisplay.length" class="stacked-definition-list mt-3">
                  <div v-for="item in scientificAssessmentRowsDisplay" :key="item.label" class="stacked-definition">
                    <span class="stacked-definition__label">{{ item.label }}</span>
                    <span class="stacked-definition__value">{{ item.value }}</span>
                  </div>
                </div>
              </section>

              <section class="details-card details-card--expert-review">
                <div class="section-header section-header--split">
                  <div class="section-header__text">
                    <p class="section-eyebrow">Formal Review</p>
                    <h3 class="section-title">Discrepancy Adjudication</h3>
                    <p class="details-subtitle details-subtitle--compact">
                      Use discrepancy review for formal expert adjudication that updates review status, resolved labels, and benchmark-facing decision logic.
                    </p>
                  </div>
                  <div class="section-header__actions">
                    <DiscrepancyReviewDialog
                      v-if="record?.['PDB Code'] || record?.pdb_code || record?.canonical_pdb_code"
                      :pdb-code="record?.['PDB Code'] || record?.pdb_code || record?.canonical_pdb_code"
                      :initial-review="record?.discrepancy_review || {}"
                      trigger-mode="button"
                      trigger-label="Review Record"
                      @updated="handleDiscrepancyReviewUpdated"
                    />
                  </div>
                </div>
                <div class="definition-grid definition-grid--compact">
                  <div class="definition-item">
                    <span class="definition-label">Review Status</span>
                    <span class="definition-value">{{ discrepancyReviewSummary.status }}</span>
                  </div>
                  <div class="definition-item">
                    <span class="definition-label">Reviewed Group</span>
                    <span class="definition-value">{{ discrepancyReviewSummary.reviewed_group }}</span>
                  </div>
                  <div class="definition-item">
                    <span class="definition-label">Reviewed TM Count</span>
                    <span class="definition-value">{{ discrepancyReviewSummary.reviewed_tm_count }}</span>
                  </div>
                  <div class="definition-item">
                    <span class="definition-label">Last Reviewed</span>
                    <span class="definition-value">{{ discrepancyReviewSummary.reviewed_at }}</span>
                  </div>
                </div>
                <div v-if="discrepancyReviewSummary.rationale" class="soft-alert soft-alert--wrap mt-3">
                  {{ discrepancyReviewSummary.rationale }}
                </div>
                <div v-if="discrepancyReviewSummary.reviewer_note" class="stacked-definition-list stacked-definition-list--tight mt-3">
                  <div class="stacked-definition structure-note-preview structure-note-preview--card">
                    <span class="stacked-definition__label">Reviewer Note</span>
                    <span class="stacked-definition__value">{{ discrepancyReviewSummary.reviewer_note }}</span>
                  </div>
                </div>
                <div v-else-if="!discrepancyReviewSummary.rationale" class="details-subtitle mt-3">
                  No formal discrepancy review has been recorded for this structure yet.
                </div>
              </section>

              <section class="details-card details-card--expert-review">
                <div class="section-header section-header--split">
                  <div class="section-header__text">
                    <p class="section-eyebrow">Expert Notes</p>
                    <h3 class="section-title">Structure Notes</h3>
                    <p class="details-subtitle details-subtitle--compact">
                      Capture free-text comments, suggestions, and structure-specific follow-up without changing the formal discrepancy-review decision.
                    </p>
                  </div>
                  <div class="section-header__actions">
                    <StructureExpertNotesDialog
                      v-if="record?.['PDB Code'] || record?.pdb_code || record?.canonical_pdb_code"
                      :pdb-code="record?.['PDB Code'] || record?.pdb_code || record?.canonical_pdb_code"
                      :initial-count="expertNoteSummary.note_count"
                      :summary="record?.expert_note_summary"
                      trigger-mode="button"
                      trigger-label="Add Note"
                      source-context="details_page"
                      @updated="handleExpertNotesUpdated"
                    />
                  </div>
                </div>
                <div class="definition-grid definition-grid--compact">
                  <div class="definition-item">
                    <span class="definition-label">Total Notes</span>
                    <span class="definition-value">{{ expertNoteSummary.note_count }}</span>
                  </div>
                  <div class="definition-item">
                    <span class="definition-label">Open Notes</span>
                    <span class="definition-value">{{ expertNoteSummary.open_note_count }}</span>
                  </div>
                  <div class="definition-item">
                    <span class="definition-label">Latest Update</span>
                    <span class="definition-value">{{ formatExpertNoteDate(expertNoteSummary.latest_note_at) }}</span>
                  </div>
                </div>
                <div v-if="expertNoteSummary.latest_note_excerpt" class="soft-alert soft-alert--wrap mt-3">
                  {{ expertNoteSummary.latest_note_excerpt }}
                </div>
                <div v-if="expertNoteSummary.recent_notes.length" class="stacked-definition-list stacked-definition-list--tight mt-3">
                  <div v-for="note in expertNoteSummary.recent_notes" :key="note.id" class="stacked-definition structure-note-preview structure-note-preview--card">
                    <div class="structure-note-preview__meta">
                      <div class="structure-note-preview__chips">
                        <span class="meta-chip">{{ note.category }}</span>
                        <span class="meta-chip meta-chip--warning" v-if="note.status === 'open'">open</span>
                        <span class="meta-chip" v-else>{{ note.status }}</span>
                      </div>
                      <span class="stacked-definition__label">{{ formatExpertNoteAuthor(note) }} • {{ formatExpertNoteDate(note.created_at) }}</span>
                    </div>
                    <span class="stacked-definition__value">{{ note.comment_excerpt || note.comment }}</span>
                  </div>
                </div>
                <div v-else class="details-subtitle mt-3">
                  No expert notes have been added for this structure yet.
                </div>
              </section>

              <section v-if="structureWarnings.length || structureContextRowsDisplay.length || externalLinks.length" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Structure</p>
                    <h3 class="section-title">Context & Links</h3>
                  </div>
                </div>
                <div v-if="structureWarnings.length" class="warning-chip-list mb-3">
                  <span v-for="warning in structureWarnings" :key="warning" class="meta-chip meta-chip--warning">
                    {{ warning }}
                  </span>
                </div>
                <div v-if="structureContextRowsDisplay.length" class="stacked-definition-list">
                  <div v-for="item in structureContextRowsDisplay" :key="item.label" class="stacked-definition">
                    <span class="stacked-definition__label">{{ item.label }}</span>
                    <span class="stacked-definition__value">{{ item.value }}</span>
                  </div>
                </div>
                <div class="external-links" v-if="externalLinks.length > 0">
                  <div class="definition-label">External Links</div>
                  <div class="link-list">
                    <a
                      v-for="link in externalLinks"
                      :key="link.label"
                      :href="link.href"
                      target="_blank"
                      rel="noopener"
                      class="pill-link"
                    >
                      {{ link.label }}
                    </a>
                  </div>
                </div>
              </section>

              <!-- ── Subunit Boundaries (OPM) ──────────────────────────────────────── -->
              <section v-if="subunitOnlyTracks.length" class="details-card">
                <div class="section-header">
                  <div>
                    <p class="section-eyebrow">Topology</p>
                    <h3 class="section-title">Subunit Boundaries</h3>
                  </div>
                </div>
                <p class="details-subtitle">
                  Per-subunit residue ranges and TM segments reported by OPM.
                </p>

                <div class="opm-subunit-count">Subunits: {{ subunitOnlyTracks.length }}</div>

                <div
                  v-for="unit in subunitOnlyTracks"
                  :key="unit.trackLabel"
                  class="opm-subunit-row"
                >
                  <span class="opm-chain">{{ unit.trackLabel }}</span>

                  <template v-if="hasMeaningfulValue(unit.tilt)">
                    <span class="opm-sep"> - Tilt: </span>
                    <span class="opm-tilt">{{ unit.tilt }}</span>
                  </template>

                  <template v-if="unit.tmSegments?.length">
                    <span class="opm-sep"> - TM segments: </span>
                    <span
                      v-for="(tm, i) in unit.tmSegments"
                      :key="i"
                      class="opm-tm"
                    >{{ i + 1 }}( {{ tm.start }}- {{ tm.end }}){{ i < unit.tmSegments.length - 1 ? ', ' : '' }}</span>
                  </template>

                  <template v-else>
                    <span v-if="hasMeaningfulValue(unit.sequenceContext)" class="opm-seq-ctx">
                      - {{ unit.sequenceContext }}
                    </span>
                  </template>
                </div>
              </section>

            </aside>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import ExpandableText from '@/components/ExpandableText.vue'
import TopologyTrackPlot from '@/components/TopologyTrackPlot.vue'
import GenericStructureViewer from '@/components/GenericStructureViewer.vue'
import StructureViewer from '@/components/StructureViewer.vue'
import DiscrepancyReviewDialog from '@/components/useCases/DiscrepancyReviewDialog.vue'
import StructureExpertNotesDialog from '@/components/useCases/StructureExpertNotesDialog.vue'
import StructureNotesRealtimeService from '@/services/structure_notes_realtime.service'
import { useDashboardStore } from '@/stores/dashboard'
// import TaxonomyFlow from '@/components/TaxonomyFlow2.vue'
import { VTreeview } from 'vuetify/labs/VTreeview'
import { explanations } from '@/utils/explanations'

function buildTaxonomyPath(path) {
  if (!Array.isArray(path) || path.length === 0) return []

  const [head, ...tail] = path
  return [
    {
      label: head,
      ...(tail.length ? { children: buildTaxonomyPath(tail) } : {})
    }
  ]
}
const taxonomy = [
  {
    label: 'Animalia',
    children: [
      {
        label: 'Chordata',
        children: [
          {
            label: 'Mammalia',
            children: [
              {
                label: 'Eutheria',
                children: [
                  {
                    label: 'Primates',
                    children: [
                      {
                        label: 'Hominidae',
                        children: [
                          {
                            label: 'Homo',
                            children: [{ label: 'sapiens' }]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'Carnivora',
                    children: [
                      {
                        label: 'Felidae',
                        children: [
                          {
                            label: 'Panthera',
                            children: [{ label: 'leo' }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
const dashboardStore = useDashboardStore()
let stopStructureNotesRealtime = null
const details = ref(null)
const record = ref(null)
const error = ref(null)
const viewerLoading = ref(true)
const viewerNotice = ref('')
const forceGenericViewer = ref(false)
const tmViewerReady = ref(false)
const opts = reactive({
  bgColor: { r: 255, g: 255, b: 255 },
  sequencePanel: true,
  membraneOrientation: false,
  side1: 'Inside',
  landscape: true
})
const searchType = ref('pdb')
const searchQuery = ref('')
const mountedReady = ref(false)
const syncingDetailsPage = ref(false)
// Derived loading states — no new refs needed
const isPageLoading = computed(() => syncingDetailsPage.value)
const hasNoQuery    = computed(() => !searchQuery.value?.trim() && !syncingDetailsPage.value)
function buildDetailsViewModel(recordLike = {}) {
  const source = recordLike || {}
  return {
    ...source,
    pdb_code: source.pdb_code || source.canonical_pdb_code || source['PDB Code'] || null,
    pdbid: source.pdbid || source.pdb_code || source.canonical_pdb_code || source['PDB Code'] || null,
    family_name: source.family_name || source.family_name_cache || null,
    family_superfamily_name: source.family_superfamily_name || null,
    species: source.species || source.organism_scientific_name || source.organism_common_name || null,
    taxonomic_domain: source.taxonomic_domain || null,
    description: source.description || source.struct_title || null,
    rcsentinfo_polymer_composition:
      source.rcsentinfo_polymer_composition
      || source.polymer_composition
      || source.structure_context?.polymer_composition
      || null,
    sequence_length:
      source.sequence_length
      || (typeof source.sequence_sequence === 'string' ? source.sequence_sequence.length : null),
    features: source.features || [],
  }
}
function getExplanation(featureName) {
  return explanations[featureName] || 'No explanation available.'
}
function parseTaxonomy(input = '') {
  return input
    ?.split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}
function getDefaultParsedValue(raw) {
  return typeof raw === 'string' && raw.trim().startsWith('[') ? [] : {}
}
function normalizePseudoJson(input) {
  return input
    .replace(/\bNaN\b/g, 'null')
    .replace(/\bNone\b/g, 'null')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) =>
      JSON.stringify(value.replace(/\\'/g, "'").replace(/\\"/g, '"'))
    )
}
function parseRawData(raw) {
  if (raw == null) {
    return {}
  }

  if (Array.isArray(raw) || typeof raw === 'object') {
    return raw
  }

  if (typeof raw !== 'string') {
    return {}
  }

  const trimmed = raw.trim()

  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
    return getDefaultParsedValue(trimmed)
  }

  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    return trimmed
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    try {
      return JSON.parse(normalizePseudoJson(trimmed))
    } catch (parseError) {
      console.error('parseRawData: JSON.parse failed:', parseError, '\ninput was:', trimmed)
      return getDefaultParsedValue(trimmed)
    }
  }
}
function capitalize(s) {
  return s && String(s[0]).toUpperCase() + String(s).slice(1)
}
function ensureArray(value) {
  return Array.isArray(value) ? value : []
}
function humanizeKey(value = '') {
  return value
    .replace(/^comment_/, '')
    .split('_')
    .filter(Boolean)
    .map((segment) => capitalize(segment))
    .join(' ')
}
function countBy(items, keyGetter) {
  return ensureArray(items).reduce((accumulator, item) => {
    const key = keyGetter(item)
    if (!key) return accumulator
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})
}
function hasMeaningfulValue(value) {
  if (value == null || value === '' || value === 'null' || value === 'undefined') {
    return false
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return false
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }

  return true
}
function getFirstMeaningfulValue(...candidates) {
  return candidates.find((candidate) => hasMeaningfulValue(candidate)) ?? null
}
function formatValue(value, suffix = '') {
  if (!hasMeaningfulValue(value)) {
    return null
  }

  return suffix ? `${value}${suffix}` : String(value)
}
function shouldDisplayRowValue(value) {
  return hasMeaningfulValue(value) && value !== 'Not Specified'
}
function filterDisplayRows(rows = []) {
  return rows.filter((row) => shouldDisplayRowValue(row?.value))
}
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('')
}
function hexToRgb(hex, target) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return
  target.r = parseInt(result[1], 16)
  target.g = parseInt(result[2], 16)
  target.b = parseInt(result[3], 16)
}
const parsedFeatures = computed(() => ensureArray(parseRawData(details.value?.features)))
const featureCounts = computed(() => countBy(parsedFeatures.value, (feature) => feature?.type))
const commentCounts = computed(() => {
  const source = details.value || {}

  return Object.entries(source).reduce((accumulator, [key, value]) => {
    if (!key.startsWith('comment_')) {
      return accumulator
    }

    const parsedValue = parseRawData(value)

    if (Array.isArray(parsedValue) && parsedValue.length > 0) {
      accumulator[humanizeKey(key)] = parsedValue.length
      return accumulator
    }

    if (!Array.isArray(parsedValue) && hasMeaningfulValue(parsedValue)) {
      accumulator[humanizeKey(key)] = 1
    }

    return accumulator
  }, {})
})
const transmembraneFeatureCount = computed(() => {
  const entry = Object.entries(featureCounts.value).find(([label]) =>
    label?.toLowerCase().includes('transmembrane')
  )

  return entry ? entry[1] : null
})

// Helper: flatten an array or semicolon string to a clean single value
function flattenNameField(val) {
  if (!val) return null
  // If it's an array, take the first element
  if (Array.isArray(val)) val = val[0]
  // If it's a string, take only the part before the first semicolon
  if (typeof val === 'string') {
    const cleaned = val.split(';')[0].trim()
    // Reject non-meaningful values
    if (!cleaned || cleaned === 'NaN' || cleaned === 'null' || cleaned === 'None') return null
    return cleaned
  }
  return null
}

// Helper: get a clean list of alternative names (for subtitle)
function flattenAltNames(val) {
  if (!val) return null
  if (Array.isArray(val)) val = val.join(';')
  if (typeof val !== 'string') return null
  const names = val
    .split(';')
    .map(s => s.trim())
    .filter(s => s && s !== 'NaN' && s !== 'null' && s !== 'None')
  return names.length ? names.join(' · ') : null
}

const displayTitle = computed(() => {
  return (
    flattenNameField(details.value?.protein_recommended_name) ||
    flattenNameField(details.value?.protein_alternative_name) ||
    searchQuery.value?.toUpperCase() ||
    'Protein record'
  )
})

const displaySubtitle = computed(() => {
  // Don't repeat the title in the subtitle
  const altNames = flattenAltNames(details.value?.protein_alternative_name)
  const desc     = flattenNameField(details.value?.description)

  // If altNames starts with the same text as the title, prefer description
  if (altNames && altNames !== displayTitle.value) return altNames
  return desc || null
})


const viewerPdbId = computed(() => {
  const candidates = [
    details.value?.pdb_code,
    details.value?.pdbid,
    searchQuery.value
  ]

  const match = candidates.find((candidate) => /^[a-z0-9]{4}$/i.test(String(candidate || '').trim()))
  return match ? String(match).trim().toUpperCase() : ''
})
const activeViewerKind = computed(() => {
  if (!viewerPdbId.value) {
    return 'generic'
  }

  if (opts.membraneOrientation && !forceGenericViewer.value) {
    return 'tm'
  }

  return 'generic'
})
const activeViewerRenderKey = computed(() => {
  if (activeViewerKind.value === 'tm') {
    return `tm:${viewerPdbId.value}:${opts.side1}:${opts.landscape}`
  }

  return `generic:${viewerPdbId.value}:${opts.membraneOrientation}:${opts.landscape}`
})
const topologyLegendItems = computed(() => {
  const side1Label = opts.side1 === 'Outside' ? 'Outside' : 'Inside'
  const side2Label = side1Label === 'Inside' ? 'Outside' : 'Inside'

  return [
    { label: side1Label, className: side1Label === 'Inside' ? 'ult_inside' : 'ult_outside' },
    { label: 'Membrane', className: 'ult_membrane' },
    { label: side2Label, className: side1Label === 'Inside' ? 'ult_outside' : 'ult_inside' },
    { label: 'Re-entrant loop', className: 'ult_reentrant' },
    { label: 'Beta barrel inside', className: 'ult_membins' },
    { label: 'Periplasm', className: 'ult_periplasm' },
    { label: 'Interfacial helix', className: 'ult_ifh' },
  ]
})
const topologyLegendNote = computed(() => {
  const side1Label = opts.side1 === 'Outside' ? 'Outside' : 'Inside'
  const side2Label = side1Label === 'Inside' ? 'Outside' : 'Inside'

  return `This legend follows the official tm_molstar palette from UNITMP/PDBTM. Side 1 is currently ${side1Label}, so the red annotation marks ${side1Label} and the blue annotation marks ${side2Label}.`
})
const showTopologyLegend = computed(() => {
  return opts.membraneOrientation && activeViewerKind.value === 'tm' && tmViewerReady.value
})
const overviewRows = computed(() => filterDisplayRows([
  {
    label: 'Associated Genes',
    value: details.value?.associated_genes
  },
  {
    label: 'Organism',
    value: details.value?.species
  },
  {
    label: 'Taxonomic Domain',
    value: details.value?.taxonomic_domain
  },
  {
    label: 'Polymer Composition',
    value: getFirstMeaningfulValue([
      structureContext.value?.polymer_composition,
      details.value?.rcsentinfo_polymer_composition
    ])
  }
]))
const heroChips = computed(() => {
  const chips = [
    lineage.value?.resolved_group_label,
    mappedGroupName.value,
    details.value?.family_name,
    details.value?.family_superfamily_name
  ]

  return [...new Set(chips.filter((chip) => shouldDisplayRowValue(chip)))]
})
const taxonomyTree = computed(() => buildTaxonomyPath(parseTaxonomy(details.value?.organism_lineage)))
const coreTaxonomyRows = computed(() => filterDisplayRows([
  { label: 'Super Kingdom', value: details.value?.taxonomic_domain },
  { label: 'Superfamily', value: details.value?.family_superfamily_name },
  { label: 'Family', value: details.value?.family_name },
  { label: 'Sub-group', value: details.value?.subgroup },
  { label: 'Species', value: details.value?.species }
]))
const sequenceInfoRows = computed(() => {
  const mass = details.value?.sequence_mass
  return filterDisplayRows([
    { label: 'Length', value: details.value?.sequence_length },
    {
      label: 'Molecular Mass',
      value:
        shouldDisplayRowValue(mass)
          ? `${mass} Da (${(Number(mass) / 1000).toFixed(1)} kDa)`
          : null
    }
  ])
})
// Tab state
const activeDbTab = ref('mpstruc')
// --- Tab 1: MPstruc ---
const mpstrucTabRows = computed(() => filterDisplayRows([
  { label: 'Name',              value: details.value?.['Name'] },
  { label: 'Group',             value: details.value?.['Group'] },
  { label: 'Subgroup',          value: details.value?.['Subgroup'] },
  { label: 'Description',       value: details.value?.['Description'] },
  { label: 'Species',           value: details.value?.['Species'] },
  { label: 'Expressed In',      value: details.value?.['Expressed in Species'] },
  { label: 'Taxonomic Domain',  value: details.value?.['Taxonomic Domain'] },
  { label: 'Resolution',        value: details.value?.['Resolution'] },
  { label: 'Master Protein',    value: details.value?.['Is Master Protein?'] },
  { label: 'Related PDB Entries', value: details.value?.['Related Pdb Entries'] },
]))
// --- Tab 2: OPM ---
const opmTabRows = computed(() => filterDisplayRows([
  { label: 'Membrane',              value: getFirstMeaningfulValue(details.value?.membrane_name, details.value?.membrane_name_cache) },
  { label: 'Membrane Short Name',   value: details.value?.membrane_short_name },
  { label: 'Topology (In)',         value: details.value?.membrane_topology_in },
  { label: 'Topology (Out)',        value: details.value?.membrane_topology_out },
  { label: 'Thickness (Å)',
    value: (() => {
      const t = details.value?.thickness
      const e = details.value?.thicknesserror
      return hasMeaningfulValue(t) ? (hasMeaningfulValue(e) ? `${t} ± ${e} Å` : `${t} Å`) : null
    })()
  },
  { label: 'Tilt (°)',
    value: (() => {
      const t = details.value?.tilt
      const e = details.value?.tilterror
      return hasMeaningfulValue(t) ? (hasMeaningfulValue(e) ? `${t} ± ${e}°` : `${t}°`) : null
    })()
  },
  { label: 'ΔG Transfer (kcal/mol)', value: hasMeaningfulValue(details.value?.gibbs) ? `${details.value.gibbs} kcal/mol` : null },
  { label: 'Subunit Segments',      value: details.value?.subunit_segments },
  { label: 'Subunit Topology',      value: details.value?.topology_subunit },
  { label: 'Subunit Count',         value: details.value?.structure_subunits_count },
  { label: 'OPM ID',                value: details.value?.opm_id },
  { label: 'Group (OPM)',           value: details.value?.['Group (OPM)'] },
  // --- Family (OPM classification) ---
  { label: 'Family',                value: getFirstMeaningfulValue(details.value?.family_name_cache, details.value?.family_name) },
  { label: 'Superfamily',           value: details.value?.family_superfamily_name },
  { label: 'Class Type',            value: details.value?.famsupclasstype_type_name },
  { label: 'Family TCDB',           value: details.value?.family_tcdb },
  { label: 'Family Pfam',           value: details.value?.family_pfam },
  { label: 'Family InterPro',       value: details.value?.family_interpro },
]))
// --- Tab 3: UniProt ---
const uniprotTabRows = computed(() => filterDisplayRows([
  { label: 'UniProtKB ID',          value: details.value?.uniProtkb_id },
  { label: 'Accession',             value: getFirstMeaningfulValue(details.value?.uniprot_id_uniprot, details.value?.uniprot_id) },
  { label: 'Secondary Accession',   value: details.value?.secondary_accession },
  { label: 'Entry Type',            value: details.value?.info_type },
  { label: 'Recommended Name',      value: details.value?.protein_recommended_name },
  { label: 'Alternative Name',      value: details.value?.protein_alternative_name },
  { label: 'Associated Genes',      value: details.value?.associated_genes },
  { label: 'Organism (Scientific)', value: details.value?.organism_scientific_name },
  { label: 'Organism (Common)',     value: details.value?.organism_common_name },
  { label: 'Sequence Length',       value: details.value?.sequence_length },
  { label: 'Molecular Mass',
    value: details.value?.sequence_mass
      ? `${Number(details.value.sequence_mass).toLocaleString()} Da` : null },
  { label: 'Annotation Score',      value: details.value?.annotation_score },
  { label: 'Molecular Function',    value: details.value?.molecular_function },
  { label: 'Cellular Component',    value: details.value?.cellular_component },
  { label: 'Biological Process',    value: details.value?.biological_process },
  { label: 'Disease',               value: details.value?.comment_disease_name },
  { label: 'Created',               value: formatTimestampValue(details.value?.info_created) },
  { label: 'Modified',              value: formatTimestampValue(details.value?.info_modified) },
  { label: 'Sequence Updated',      value: formatTimestampValue(details.value?.info_sequence_update) },
]))
// --- Tab 4: PDB ---
const pdbTabRows = computed(() => filterDisplayRows([
  { label: 'PDB Code',              value: getFirstMeaningfulValue(details.value?.pdb_code, details.value?.canonical_pdb_code) },
  { label: 'Experimental Method',   value: getFirstMeaningfulValue(details.value?.exptl_method, details.value?.rcsb_entry_info_experimental_method) },
  { label: 'Resolution (Å)',        value: getFirstMeaningfulValue(details.value?.processed_resolution, details.value?.rcsb_entry_info_resolution_combined) },
  { label: 'Molecular Weight (kDa)',
    value: (() => {
      const mw = details.value?.rcsb_entry_info_molecular_weight
      return hasMeaningfulValue(mw) ? `${Number(mw).toFixed(1)} kDa` : null
    })()
  },
  { label: 'Assembly Count',        value: details.value?.rcsb_entry_info_assembly_count },
  { label: 'Deposited Atom Count',  value: details.value?.rcsb_entry_info_deposited_atom_count },
  { label: 'Polymer Composition',   value: getFirstMeaningfulValue(details.value?.rcsb_entry_info_polymer_composition, structureContext.value?.polymercomposition) },
  { label: 'Selected Entity Types', value: details.value?.rcsb_entry_info_selected_polymer_entity_types },
  { label: 'Space Group',           value: details.value?.symmetry_space_group_name_hm },
  // --- Unit cell parameters ---
  { label: 'Cell α (°)',            value: details.value?.cell_angle_alpha_pdb },
  { label: 'Cell β (°)',            value: details.value?.cell_angle_beta_pdb },
  { label: 'Cell γ (°)',            value: details.value?.cell_angle_gamma_pdb },
  { label: 'Cell a (Å)',            value: details.value?.cell_length_a_pdb },
  { label: 'Cell b (Å)',            value: details.value?.cell_length_b_pdb },
  { label: 'Cell c (Å)',            value: details.value?.cell_length_c_pdb },
  { label: 'Cell Z',                value: details.value?.cell_zpdb_pdb },
  // ---
  { label: 'Point Symmetry',        value: details.value?.structure_context?.point_symmetry },
  { label: 'Software Used',         value: details.value?.rcsb_entry_info_software_programs_combined },
  { label: 'Status Code',           value: details.value?.rcsb_accession_info_status_code },
  { label: 'Deposit Site',          value: details.value?.pdbx_database_status_process_site },
  { label: 'Journal',               value: details.value?.rcsb_primary_citation_journal_abbrev },
  { label: 'Country',               value: details.value?.rcsb_primary_citation_country },
  { label: 'Deposition Date',       value: formatTimestampValue(details.value?.rcsb_accession_info_deposit_date) },
  { label: 'Initial Release Date',  value: formatTimestampValue(details.value?.rcsb_accession_info_initial_release_date) },
  { label: 'Last Revision Date',    value: formatTimestampValue(details.value?.rcsb_accession_info_revision_date) },
]))
// --- Related PDB entries helpers (MPstruc row) ----------------------

// Parse the "Related Pdb Entries" cell into an array of PDB codes
function parseRelatedPdbValue(raw) {
  if (!hasMeaningfulValue(raw)) return []

  if (Array.isArray(raw)) {
    return raw.map(x => String(x).toUpperCase()).filter(Boolean)
  }

  try {
    const parsed = JSON.parse(String(raw))
    if (Array.isArray(parsed)) {
      return parsed.map(x => String(x).toUpperCase()).filter(Boolean)
    }
  } catch (e) {
    // ignore and fall through
  }

  return String(raw)
    .replace(/[\[\]"']/g, '')
    .split(/[\s,]+/)
    .map(x => x.toUpperCase())
    .filter(Boolean)
}

// Fixed providers shown in the cell
const relatedProviders = [
  { key: 'memprotmd', label: 'memprotmd' },
  { key: 'pdb',       label: 'PDB' },
  { key: 'opm',       label: 'OPM' },
  { key: 'pdbtm',     label: 'PDBTM' },
]

// Build a URL per provider + code
function buildProviderUrl(providerKey, code) {
  const upper = String(code).toUpperCase()
  switch (providerKey) {
    case 'memprotmd':
      return `https://memprotmd.bioch.ox.ac.uk/_ref/PDB/${upper}/_sim/${upper}_default_dppc/`
    case 'pdb':
      return `https://www.rcsb.org/3d-view/jsmol/${upper}`
    case 'opm':
      return `https://opm.phar.umich.edu/proteins/${upper}`
    case 'pdbtm':
      return `https://pdbtm.unitmp.org/entry/${upper}`
    default:
      return '#'
  }
}

const openProvider = ref(null) // which provider's dropdown is open

function openProviderDropdown(key) {
  openProvider.value = key
}

function closeProviderDropdown(key) {
  if (openProvider.value === key) openProvider.value = null
}

function openInNewTab(url) {
  window.open(url, '_blank', 'noopener')
}
// --- Tab definitions: exactly 4, hide if empty ---
const DB_TABS = [
  { key: 'mpstruc', label: 'MPstruc',  badge: 'MP',  color: '#0369a1', rowsRef: 'mpstrucTabRows' },
  { key: 'opm',     label: 'OPM',      badge: 'OPM', color: '#166534', rowsRef: 'opmTabRows'     },
  { key: 'uniprot', label: 'UniProt',  badge: 'UP',  color: '#9a3412', rowsRef: 'uniprotTabRows' },
  { key: 'pdb',     label: 'PDB',      badge: 'PDB', color: '#4f46e5', rowsRef: 'pdbTabRows'     },
]
const rowsMap = { mpstrucTabRows, opmTabRows, uniprotTabRows, pdbTabRows }
const dbTabsAvailable = computed(() => {
  const tabs = DB_TABS
    .map(def => ({ ...def, rows: rowsMap[def.rowsRef].value }))
    .filter(tab => tab.rows.length > 0)
  if (tabs.length && !tabs.find(t => t.key === activeDbTab.value)) {
    activeDbTab.value = tabs[0].key
  }
  return tabs
})
// TEMP DEBUG — remove after fixing
watch(details, (val) => {
  if (!val) return
  console.log('=== UniProt keys ===')
  console.log('uniProtkbid:', val?.uniProtkbid)
  console.log('uniprotiduniprot:', val?.uniprotiduniprot)
  console.log('infotype:', val?.infotype)
  console.log('infocreated:', val?.infocreated)
  console.log('sequencelength:', val?.sequencelength)
  console.log('annotationscore:', val?.annotationscore)

  console.log('=== PDB keys ===')
  console.log('exptlmethod:', val?.exptlmethod)
  console.log('processedresolution:', val?.processedresolution)
  console.log('rcsbentryinfomolecularweight:', val?.rcsbentryinfomolecularweight)
  console.log('rcsbaccessioninfodepositdate:', val?.rcsbaccessioninfodepositdate)
  console.log('rcsbprimarycitationjournalabbrev:', val?.rcsbprimarycitationjournalabbrev)
  console.log('symmetryspacegroupnamehm:', val?.symmetryspacegroupnamehm)
}, { immediate: true })

const functionalRows = computed(() => filterDisplayRows([
  { label: 'Biological Process', value: details.value?.biological_process },
  { label: 'Cellular Components', value: details.value?.cellular_component },
  { label: 'Molecular Functions', value: details.value?.molecular_function },
  { label: 'Disease', value: details.value?.comment_disease_name }
]))

const selectedClassificationRows = computed(() => {
  const source = details.value || {}
  const annotation = record.value || {}
  const labels = lineage.value.labels || {}

  const rows = [
    {
      label: 'PDB Code',
      value: getFirstMeaningfulValue([
        annotation['PDB Code'],
        source.pdb_code,
        source.pdbid,
        searchQuery.value?.toUpperCase()
      ])
    },
    {
      label: 'Group (OPM)',
      value: getFirstMeaningfulValue([
        annotation['Group (OPM)'],
        formatOpmAssignment(annotation),
        formatOpmAssignment(source),
        labels.opm
      ])
    },
    {
      label: 'Group (MPstruc)',
      value: getFirstMeaningfulValue([
        formatMpstrucAssignment(annotation),
        formatMpstrucAssignment(source),
        annotation['Group (MPstruc)'],
        annotation.Group,
        labels.mpstruc,
        mappedGroupName.value
      ])
    },
    {
      label: 'Group (Expert)',
      value: getFirstMeaningfulValue([
        labels.expert,
        annotation['Group (Expert)'],
        annotation.group_expert
      ])
    },
    {
      label: 'Group (Predicted)',
      value: getFirstMeaningfulValue([
        labels.predicted,
        annotation['Group (Predicted)'],
        annotation.group_predicted
      ])
    },
    {
      label: 'Family',
      value: getFirstMeaningfulValue([annotation.family_name, source.family_name])
    },
    {
      label: 'Superfamily',
      value: getFirstMeaningfulValue([
        annotation.family_superfamily_name,
        source.family_superfamily_name
      ])
    },
    {
      label: 'Membrane',
      value: getFirstMeaningfulValue([
        annotation['Membrane'],
        annotation.membrane_name,
        source.membrane_name
      ])
    },
    {
      label: 'Membrane Topology In',
      value: getFirstMeaningfulValue([
        annotation['Membrane Topology In'],
        annotation.membrane_topology_in,
        source.membrane_topology_in
      ])
    },
    {
      label: 'Membrane Topology Out',
      value: getFirstMeaningfulValue([
        annotation['Membrane Topology Out'],
        annotation.membrane_topology_out,
        source.membrane_topology_out
      ])
    },
    {
      label: 'Thickness',
      value: formatValue(getFirstMeaningfulValue([annotation.thickness, source.thickness]))
    },
    {
      label: 'Thickness Error',
      value: formatValue(
        getFirstMeaningfulValue([annotation.thicknesserror, source.thicknesserror])
      )
    },
    {
      label: 'Tilt',
      value: formatValue(getFirstMeaningfulValue([annotation.tilt, source.tilt]))
    },
    {
      label: 'Tilt Error',
      value: formatValue(getFirstMeaningfulValue([annotation.tilterror, source.tilterror]))
    },
    {
      label: 'Gibbs',
      value: formatValue(getFirstMeaningfulValue([annotation.gibbs, source.gibbs]))
    },
    {
      label: 'TM (Expert)',
      value: getFirstMeaningfulValue([annotation['TM (Expert)'], annotation.tm_expert])
    }
  ]

  return rows.filter((row) => hasMeaningfulValue(row.value))
})

function parseTmRegions(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function ensureTrackCoverage(segments, sequenceLength) {
  const normalizedSegments = ensureArray(segments)
    .map((segment) => ({
      ...segment,
      start: Number(segment?.start),
      end: Number(segment?.end),
      length: Number(segment?.length ?? ((Number(segment?.end) || 0) - (Number(segment?.start) || 0) + 1))
    }))
    .filter((segment) => Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end >= segment.start)
    .sort((left, right) => left.start - right.start)

  if (!sequenceLength || !normalizedSegments.length) {
    return normalizedSegments
  }

  const covered = []
  let cursor = 1

  normalizedSegments.forEach((segment) => {
    if (segment.start > cursor) {
      covered.push({
        label: 'Outside',
        kind: 'outside',
        start: cursor,
        end: segment.start - 1,
        length: segment.start - cursor
      })
    }
    covered.push(segment)
    cursor = Math.max(cursor, segment.end + 1)
  })

  if (cursor <= sequenceLength) {
    covered.push({
      label: 'Outside',
      kind: 'outside',
      start: cursor,
      end: sequenceLength,
      length: sequenceLength - cursor + 1
    })
  }

  return covered
}

function formatTmRegions(value) {
  const regions = parseTmRegions(value)
  if (!regions.length) return 'Not Specified'
  return regions
    .map((region) => {
      const start = region.start ?? '?'
      const end = region.end ?? '?'
      const topology = region.topology ? ` (${region.topology})` : ''
      return `${start}-${end}${topology}`
    })
    .join(', ')
}

function formatListValue(value) {
  if (!hasMeaningfulValue(value)) return 'Not Specified'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function formatTimestampValue(value) {
  if (!hasMeaningfulValue(value)) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return String(value)
  return parsed.toLocaleString()
}

function formatOpmAssignment(recordLike = {}) {
  const className = getFirstMeaningfulValue([
    recordLike?.family_superfamily_classtype_name
  ])
  const typeName = getFirstMeaningfulValue([
    recordLike?.famsupclasstype_type_name
  ])

  if (hasMeaningfulValue(className) && hasMeaningfulValue(typeName)) {
    return `${className} (${typeName})`
  }

  return getFirstMeaningfulValue([className, typeName])
}

function formatMpstrucAssignment(recordLike = {}) {
  const group = getFirstMeaningfulValue([recordLike?.Group, recordLike?.['Group (MPstruc)']])
  const subgroup = getFirstMeaningfulValue([recordLike?.subgroup])

  if (hasMeaningfulValue(group) && hasMeaningfulValue(subgroup)) {
    return `${group} / ${subgroup}`
  }

  return getFirstMeaningfulValue([group, subgroup])
}

const resolvedRecord = computed(() => record.value || {})
const recordResolution = computed(() => resolvedRecord.value.record_resolution || {})
const lineage = computed(() => resolvedRecord.value.annotation_lineage || {})
const provenance = computed(() => resolvedRecord.value.provenance || {})
const confidence = computed(() => provenance.value.confidence || {})
const scientificAssessment = computed(() => resolvedRecord.value.scientific_assessment || {})
const structureContext = computed(() => resolvedRecord.value.structure_context || {})
const uiSections = computed(() => resolvedRecord.value.ui_sections || {})
const comparisonSection = computed(() => uiSections.value.comparison || {})
const scientificFlagSection = computed(() => uiSections.value.scientific_flags || {})
const tmPredictionSummary = computed(
  () => uiSections.value.tm_prediction_summary || resolvedRecord.value.tm_prediction_summary_card || {}
)
const tmInterpretations = computed(() =>
  ensureArray((uiSections.value.tm_boundaries || {}).interpretations || [])
)

function formatPredictorLabel(provider, method) {
  const parts = [provider, method].filter((part) => shouldDisplayRowValue(part))
  return parts.join(' ') || null
}

const preferredTmInterpretation = computed(() => {
  const preferred = tmPredictionSummary.value || {}
  const matchingInterpretation = tmInterpretations.value.find(
    (item) =>
      item?.provider === preferred.preferred_provider
      && item?.method === preferred.preferred_method
  )
  return matchingInterpretation || tmInterpretations.value[0] || null
})

const preferredDerivedTopology = computed(
  () => preferredTmInterpretation.value?.derived_topology || {}
)

// const topologyTrackItems = computed(() =>
//   ensureArray(preferredDerivedTopology.value?.topology_map || []).map((item) => ({
//     label: item?.label || 'Region',
//     kind: item?.kind || 'other',
//     range:
//       item?.start != null && item?.end != null
//         ? `${item.start}-${item.end}${item?.length != null ? ` (${item.length} aa)` : ''}`
//         : 'Range not specified'
//   }))
// )

const topologyTrackItems = computed(() =>
  ensureArray(preferredDerivedTopology.value?.topology_map || []).map((item) => ({
    label: item?.label || 'Region',
    kind: item?.kind || 'other',
    range:
      item?.start != null && item?.end != null
        ? `${item.start}-${item.end}${item?.length != null ? ` (${item.length} aa)` : ''}`
        : 'Range not specified'
  }))
)

// ← ADD THIS
const TRACK_PAGE_SIZE = 10
const visibleTrackCount = ref(TRACK_PAGE_SIZE)

const tmSummaryHighlights = computed(() =>
  filterDisplayRows([
    {
      label: 'Primary Method',
      value: formatPredictorLabel(
        tmPredictionSummary.value?.preferred_provider,
        tmPredictionSummary.value?.preferred_method
      )
    },
    {
      label: 'Orientation',
      value: tmPredictionSummary.value?.preferred_orientation_label
    },
    {
      label: 'Topology Class',
      value: tmPredictionSummary.value?.preferred_topology_class
    },
    {
      label: 'Supporting Methods',
      value: tmPredictionSummary.value?.method_count
    }
  ])
)

const tmSummaryFlags = computed(() => {
  const flags = []
  if (tmPredictionSummary.value?.has_structure_based_evidence) {
    flags.push('Includes structure-aware TMDET evidence')
  }
  if (tmPredictionSummary.value?.has_signal_peptide_evidence) {
    flags.push('Signal peptide evidence available')
  }
  if (tmPredictionSummary.value?.has_ambiguous_results) {
    flags.push('Some predictor mappings are ambiguous')
  }
  return flags
})

const tmSupportingMethodChips = computed(() =>
  ensureArray(tmPredictionSummary.value?.available_methods || []).slice(0, 12)
)

const tmInterpretationNotes = computed(() => {
  const derived = preferredDerivedTopology.value || {}
  const notes = []
  if (shouldDisplayRowValue(derived.chain_summary)) {
    notes.push(derived.chain_summary)
  }
  ensureArray(derived.loop_annotations).forEach((item) => {
    if (shouldDisplayRowValue(item?.summary)) {
      notes.push(item.summary)
    }
  })
  ensureArray(derived.caveats).forEach((item) => {
    if (shouldDisplayRowValue(item)) {
      notes.push(item)
    }
  })
  return [...new Set(notes)]
})

const recordResolutionRows = computed(() => {
  const rows = [
    {
      label: 'Selected Group',
      value: recordResolution.value.selected_group_label || 'Not Specified'
    },
    {
      label: 'Group Source',
      value: recordResolution.value.selected_group_source || 'Not Specified'
    },
    {
      label: 'Selected TM Count',
      value: recordResolution.value.selected_tm_count ?? 'Not Specified'
    },
    {
      label: 'TM Source',
      value: recordResolution.value.selected_tm_source || 'Not Specified'
    },
    {
      label: 'Review Status',
      value: recordResolution.value.review_status || 'open'
    },
    {
      label: 'Replacement Strategy',
      value: recordResolution.value.replacement_strategy || 'current_record'
    },
    {
      label: 'Disagreement Flags',
      value: formatListValue(recordResolution.value.disagreement_flags)
    }
  ]
  return rows
})

const recordResolutionRowsDisplay = computed(() => filterDisplayRows(recordResolutionRows.value))

const provenanceRows = computed(() => {
  const rows = [
    {
      label: 'Sources Present',
      value: formatListValue(provenance.value.sources_present)
    },
    {
      label: 'Annotation Score',
      value: confidence.value.annotation_score ?? 'Not Specified'
    },
    {
      label: 'Annotation Score Band',
      value: confidence.value.annotation_score_band || 'Not Specified'
    },
    {
      label: 'Expert vs Prediction Agreement',
      value:
        confidence.value.expert_vs_prediction_agreement == null
          ? 'Not Specified'
          : confidence.value.expert_vs_prediction_agreement
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Predictor Consensus',
      value:
        confidence.value.predictor_consensus == null
          ? 'Not Specified'
          : confidence.value.predictor_consensus
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Replacement Status',
      value: confidence.value.replacement_status || 'Not Specified'
    }
  ]
  return rows
})

const provenanceRowsDisplay = computed(() => filterDisplayRows(provenanceRows.value))

const lineageRows = computed(() => {
  const labels = lineage.value.labels || {}
  return [
    { label: 'Resolved Group Label', value: lineage.value.resolved_group_label || 'Not Specified' },
    { label: 'MPstruc', value: labels.mpstruc || 'Not Specified' },
    { label: 'OPM', value: labels.opm || 'Not Specified' },
    { label: 'Predicted', value: labels.predicted || 'Not Specified' },
    { label: 'Expert', value: labels.expert || 'Not Specified' },
    { label: 'Adjudicated', value: labels.adjudicated || 'Not Specified' },
    { label: 'Legacy PDB', value: lineage.value.legacy_pdb_code || 'Not Specified' },
    { label: 'Replacement PDB', value: lineage.value.replacement_pdb_code || 'Not Specified' }
  ]
})

const lineageRowsDisplay = computed(() => {
  const rows = filterDisplayRows(lineageRows.value)
  const onlyLegacyCode = rows.length === 1 && rows[0].label === 'Legacy PDB'
  return onlyLegacyCode ? [] : rows
})

const scientificAssessmentRows = computed(() => {
  const rows = ensureArray(scientificFlagSection.value.items || []).map((item) => ({
    key: item?.key || item?.label,
    label: item?.label || 'Scientific flag',
    value: item?.value ? 'Yes' : 'No'
  }))

  rows.unshift({
    key: 'scientific_confidence',
    label: 'Confidence',
    value: scientificAssessment.value.confidence
      ? String(scientificAssessment.value.confidence).replace(/^./, (char) => char.toUpperCase())
      : 'Not Specified'
  })

  rows.push({
    key: 'review_recommended',
    label: 'Review Recommended',
    value:
      scientificAssessment.value.review_recommended == null
        ? 'Not Specified'
        : scientificAssessment.value.review_recommended
          ? 'Yes'
          : 'No'
  })

  rows.push({
    key: 'matched_rule_ids',
    label: 'Matched Rule IDs',
    value: formatListValue((scientificAssessment.value.details || {}).matched_rule_ids)
  })

  rows.push({
    key: 'soft_review_reasons',
    label: 'Soft Review Reasons',
    value: formatListValue((scientificAssessment.value.details || {}).soft_review_reasons)
  })

  rows.push({
    key: 'context_reasons',
    label: 'Context Reasons',
    value: formatListValue((scientificAssessment.value.details || {}).context_reasons)
  })

  rows.push({
    key: 'assessment_notes',
    label: 'Assessment Notes',
    value: formatListValue(scientificFlagSection.value.notes || scientificAssessment.value.notes)
  })

  return rows
})

const scientificAssessmentRowsDisplay = computed(() =>
  filterDisplayRows(
    scientificAssessmentRows.value.filter((item) => {
      if (item.key === 'recommended_for_sequence_topology_benchmark') {
        return item.value === 'No'
      }

      if (['context_dependent_topology', 'non_canonical_membrane_case', 'multichain_context', 'obsolete_or_replaced'].includes(item.key)) {
        return item.value === 'Yes'
      }

      if (item.key === 'review_recommended') {
        return item.value === 'Yes'
      }

      return true
    })
  )
)

const expertNoteSummary = computed(() => {
  const summary = record.value?.expert_note_summary || {}
  return {
    note_count: Number(summary.note_count || record.value?.expert_note_count || 0),
    open_note_count: Number(summary.open_note_count || record.value?.open_expert_note_count || 0),
    latest_note_at: summary.latest_note_at || null,
    latest_note_excerpt: summary.latest_note_excerpt || null,
    recent_notes: Array.isArray(summary.recent_notes) ? summary.recent_notes : [],
  }
})

const discrepancyReviewSummary = computed(() => {
  const review = record.value?.discrepancy_review || {}
  const status = String(review?.status || 'open').trim().toLowerCase() || 'open'

  return {
    status: status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    reviewed_group: review?.reviewed_group || 'Not specified',
    reviewed_tm_count:
      review?.reviewed_tm_count === null || review?.reviewed_tm_count === undefined || review?.reviewed_tm_count === ''
        ? 'Not specified'
        : review.reviewed_tm_count,
    reviewed_at: review?.reviewed_at ? formatExpertNoteDate(review?.reviewed_at) : 'Not reviewed yet',
    rationale: review?.rationale || '',
    reviewer_note: review?.reviewer_note || '',
  }
})

function formatExpertNoteDate(value) {
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

function formatExpertNoteAuthor(note) {
  return note?.author?.name || note?.author?.username || note?.author?.email || 'Expert user'
}


function normalizePdbCode(value) {
  const text = String(value || '').trim().toUpperCase()
  return text || null
}

function handleStructureNoteRealtimeUpdate(payload) {
  const recordCodes = new Set([
    record.value?.['PDB Code'],
    record.value?.pdb_code,
    record.value?.canonical_pdb_code,
  ].map((value) => normalizePdbCode(value)).filter(Boolean))

  if (!recordCodes.size) return
  const eventCodes = [payload?.pdb_code, payload?.canonical_pdb_code]
    .map((value) => normalizePdbCode(value))
    .filter(Boolean)
  if (!eventCodes.some((value) => recordCodes.has(value))) return

  handleExpertNotesUpdated(payload?.summary)
}

function resubscribeStructureNotesRealtime() {
  if (typeof stopStructureNotesRealtime === 'function') {
    stopStructureNotesRealtime()
    stopStructureNotesRealtime = null
  }

  const pdbCodes = [record.value?.['PDB Code'], record.value?.canonical_pdb_code].filter(Boolean)
  if (!pdbCodes.length) return

  stopStructureNotesRealtime = StructureNotesRealtimeService.subscribeToStructureNotes(
    pdbCodes,
    handleStructureNoteRealtimeUpdate,
  )
}

watch(
  () => [record.value?.['PDB Code'], record.value?.canonical_pdb_code],
  () => {
    resubscribeStructureNotesRealtime()
  },
  { immediate: true }
)

function handleExpertNotesUpdated(summary) {
  if (!record.value) return
  const normalizedSummary = {
    note_count: Number(summary?.note_count || 0),
    open_note_count: Number(summary?.open_note_count || 0),
    latest_note_at: summary?.latest_note_at || null,
    latest_note_excerpt: summary?.latest_note_excerpt || null,
    recent_notes: Array.isArray(summary?.recent_notes) ? summary.recent_notes : [],
  }
  record.value = {
    ...record.value,
    expert_note_summary: normalizedSummary,
    expert_note_count: normalizedSummary.note_count,
    open_expert_note_count: normalizedSummary.open_note_count,
  }
  details.value = buildDetailsViewModel(record.value)
}

async function handleDiscrepancyReviewUpdated() {
  await fetchRecord()
}

const scientificAssessmentHighlight = computed(() => {
  if (scientificAssessment.value.recommended_for_sequence_topology_benchmark === false) {
    return {
      message: 'Use caution: this record is not ideal for sequence-only topology benchmarking.',
      isCaution: true
    }
  }

  if (scientificAssessmentRowsDisplay.value.length > 0) {
    return {
      message: 'This record carries additional scientific caveats that may affect interpretation.',
      isCaution: true
    }
  }

  return {
    message: 'No major scientific caveats were identified for this record.',
    isCaution: false
  }
})

const tmBoundaryRows = computed(() => {
  return ensureArray(preferredDerivedTopology.value?.topology_map || []).map((item) => ({
    label: item?.label || 'Region',
    value: [
      item?.start != null && item?.end != null ? `${item.start}-${item.end}` : null,
      item?.length != null ? `${item.length} aa` : null
    ]
      .filter(Boolean)
      .join(' · ')
  }))
})

const tmBoundaryRowsDisplay = computed(() => filterDisplayRows(tmBoundaryRows.value))

function parseOpmSegmentString(segStr) {
  if (!segStr) return []
  // matches: " 1( 20- 40)" or "2( 249- 262)" etc.
  const pattern = /\d+\(\s*(\d+)\s*-\s*(\d+)\s*\)/g
  const result = []
  let match
  while ((match = pattern.exec(segStr)) !== null) {
    result.push({ start: Number(match[1]), end: Number(match[2]) })
  }
  return result
}
// ─── Subunit boundary segments (OPM subunitsegments) ───────────────────────
const CHAIN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const parsedSubunitSegments = computed(() => {
  const raw = details.value?.subunits
  if (!hasMeaningfulValue(raw)) return []

  // normalizePseudoJson handles None -> null, single quotes -> double quotes
  let arr
  try {
    arr = ensureArray(parseRawData(raw))
  } catch {
    return []
  }

  return arr.map((item) => {
    const chain      = item?.protein_letter ?? '?'
    const tilt       = item?.tilt != null ? Number(item.tilt) : null
    const tmSegments = parseOpmSegmentString(item?.segment ?? '')
    const start      = tmSegments[0]?.start ?? null
    const end        = tmSegments[tmSegments.length - 1]?.end ?? null
    const length     = (start != null && end != null) ? end - start + 1 : null

    return { chain, tilt, tmSegments, start, end, length }
  })
})

const subunitOnlyTracks = computed(() => {
  return parsedSubunitSegments.value.map((seg) => ({
    trackLabel:      seg.chain,
    tilt:            seg.tilt,
    tmSegments:      seg.tmSegments,
    sequenceContext: seg.start != null
      ? `Residues ${seg.start}–${seg.end} · ${seg.length} aa`
      : null,
  }))
})

const tmBoundarySequenceLength = computed(() => {
  const explicitLength = Number(details.value?.sequence_length || resolvedRecord.value?.sequence_length)
  if (Number.isFinite(explicitLength) && explicitLength > 0) {
    return explicitLength
  }
  const sequence = details.value?.sequence_sequence || ''
  return sequence.length || 0
})

const tmBoundaryPlotTracks = computed(() =>
  {
    const sequenceLength = tmBoundarySequenceLength.value
    const tracks = []
    const summary = tmPredictionSummary.value || {}
    const preferredKey = `${summary.preferred_provider || ''}::${summary.preferred_method || ''}`
    const pushTrack = (track) => {
      if (!track?.segments?.length) return
      if (tracks.some((item) => item.trackLabel === track.trackLabel)) return
      tracks.push(track)
    }

    const orderedInterpretations = [...tmInterpretations.value].sort((left, right) => {
      const leftKey = `${left?.provider || ''}::${left?.method || ''}`
      const rightKey = `${right?.provider || ''}::${right?.method || ''}`
      const score = (item, itemKey) => {
        if (itemKey === preferredKey) return 0
        if (item?.provider === 'MetaMP' && item?.method === 'TMbed') return 1
        if (item?.provider === 'TMAlphaFold' && item?.method === 'DeepTMHMM') return 2
        if (item?.provider === 'TMAlphaFold' && item?.method === 'TMDET') return 98
        return 10
      }
      const scoreDiff = score(left, leftKey) - score(right, rightKey)
      if (scoreDiff !== 0) return scoreDiff
      return `${left?.provider || ''} ${left?.method || ''}`.localeCompare(
        `${right?.provider || ''} ${right?.method || ''}`
      )
    })

    orderedInterpretations.forEach((item) => {
        const derived = item?.derived_topology || {}
        const sourceSegments = ensureArray(derived.topology_map).length
          ? ensureArray(derived.topology_map).map((segment) => ({
            label: segment.label,
            kind: segment.kind,
            start: segment.start,
            end: segment.end,
            length: segment.length
          }))
          : parseTmRegions(item?.tm_regions_json).map((segment, index) => ({
            label: segment.label || `TM${index + 1}`,
            kind: String(segment.label || '').toLowerCase().includes('signal')
              ? 'signal'
              : String(segment.label || '').toLowerCase().includes('inside')
                ? 'inside'
                : String(segment.label || '').toLowerCase().includes('outside')
                  ? 'outside'
                  : 'membrane',
            start: segment.start,
            end: segment.end,
            length: segment.length
          }))

        const topologySegments = ensureTrackCoverage(
          sourceSegments.length
            ? sourceSegments
            : (
                item?.tm_count === 0 && sequenceLength > 0
                  ? [{
                    label: 'Outside',
                    kind: 'outside',
                    start: 1,
                    end: sequenceLength,
                    length: sequenceLength
                  }]
                  : []
              ),
          sequenceLength
        )
        if (!topologySegments.length) return

        const isPreferred =
          item?.provider === summary.preferred_provider && item?.method === summary.preferred_method
        pushTrack({
          trackLabel: [
            `${item?.provider || ''} ${item?.method || ''}`.trim(),
            isPreferred ? 'preferred' : null
          ].filter(Boolean).join(' · '),
          sequenceContext: item?.method === 'TMDET'
            ? 'Structure-aware membrane placement'
            : item?.provider === 'MetaMP'
              ? 'Local sequence prediction'
              : 'UniProt sequence prediction',
          segments: topologySegments
        })
    })
    return tracks
  }
)

const groupComparisonRows = computed(() => {
  const providedRows = ensureArray(comparisonSection.value?.group_rows || [])
  if (providedRows.length) {
    return providedRows.map((item) => ({
      source: item?.source || 'Unknown',
      value: hasMeaningfulValue(item?.value) ? item.value : 'Not available'
    }))
  }

  return [
    {
      source: 'Expert',
      value: getFirstMeaningfulValue([
        record.value?.['Group (Expert)'],
        record.value?.group_expert
      ])
    },
    {
      source: 'Predicted',
      value: getFirstMeaningfulValue([
        record.value?.['Group (Predicted)'],
        record.value?.group_predicted,
        comparisonSection.value?.group_rows?.find?.((item) => item.source === 'Predicted')?.value
      ])
    },
    {
      source: 'OPM',
      value: getFirstMeaningfulValue([
        record.value?.['Group (OPM)'],
        formatOpmAssignment(record.value),
        formatOpmAssignment(resolvedRecord.value),
        formatOpmAssignment(details.value),
        lineage.value?.labels?.opm
      ])
    },
    {
      source: 'MPstruc',
      value: getFirstMeaningfulValue([
        formatMpstrucAssignment(record.value),
        formatMpstrucAssignment(resolvedRecord.value),
        formatMpstrucAssignment(details.value),
        record.value?.['Group (MPstruc)'],
        record.value?.Group,
        lineage.value?.labels?.mpstruc,
        mappedGroupName.value
      ])
    }
  ].map((item) => ({
    source: item.source,
    value: hasMeaningfulValue(item.value) ? item.value : 'Not available'
  }))
})

const tmSegmentComparisonRows = computed(() =>
  ensureArray(comparisonSection.value?.segment_rows || [])
    .map((item) => ({
      source: item?.source || 'Unknown',
      value: hasMeaningfulValue(item?.value) ? item.value : 'Not available'
    }))
    .filter((item) => item.value !== 'Not available' || ['Expert', 'OPM'].includes(item.source))
)

const tmSegmentNote = computed(() => comparisonSection.value.segment_note || '')

const tmBoundaryTableRows = computed(() => {
  const rows = ensureArray((uiSections.value.tm_boundaries || {}).rows || [])
  return rows.map((item) => {
    const start = item.start ?? 'Not Specified'
    const end = item.end ?? 'Not Specified'
    const numericStart = Number(item.start)
    const numericEnd = Number(item.end)
    const length =
      Number.isFinite(numericStart) && Number.isFinite(numericEnd)
        ? numericEnd - numericStart + 1
        : 'Not Specified'

    return {
      source: item.source || 'Unknown',
      start,
      end,
      length,
      chain: item.chain_label || item.chain_id || item.chain || 'Sequence',
      topology: item.topology || item.label || 'TM segment'
    }
  })
})

const tmSourceStatusRowsDisplay = computed(() =>
  filterDisplayRows(
    ensureArray((uiSections.value.tm_boundaries || {}).source_status || []).map((item) => ({
      label: item.source || 'Unknown source',
      value: item.available
        ? `${item.tm_count ?? 'Not Specified'} TM count; ${item.boundary_count ?? 0} boundary row(s)`
        : 'Not available'
    }))
  )
)

const benchmarkContext = computed(() => uiSections.value.benchmark_context || {})
const benchmarkContextRowsDisplay = computed(() =>
  filterDisplayRows([
    {
      label: 'Recommended for Sequence-only Benchmark',
      value:
        benchmarkContext.value.recommended_for_sequence_topology_benchmark == null
          ? 'Not Specified'
          : benchmarkContext.value.recommended_for_sequence_topology_benchmark
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Benchmark Exclusion Reasons',
      value: formatListValue(benchmarkContext.value.benchmark_exclusion_reasons)
    }
  ])
)

const liveStatusRowsDisplay = computed(() =>
  filterDisplayRows([
    {
      label: 'Annotation Reference Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).annotation_dataset_modified_at)
    },
    {
      label: 'Live Group Predictions Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).live_group_predictions_modified_at)
    },
    {
      label: 'TM Prediction Summary Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).tm_prediction_summary_modified_at)
    },
    {
      label: 'PDB Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).pdb_dataset_modified_at)
    },
    {
      label: 'OPM Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).opm_dataset_modified_at)
    },
    {
      label: 'UniProt Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).uniprot_dataset_modified_at)
    }
  ])
)

const structureWarnings = computed(() =>
  ensureArray((uiSections.value.structure_context || {}).warnings || structureContext.value.warnings || [])
)

const structureContextRows = computed(() => {
  return [
    { label: 'Chain IDs', value: formatListValue(structureContext.value.chain_ids) },
    { label: 'Chain Count', value: structureContext.value.chain_count ?? 'Not Specified' },
    { label: 'Entity IDs', value: formatListValue(structureContext.value.entity_ids) },
    { label: 'Assembly IDs', value: formatListValue(structureContext.value.assembly_ids) },
    { label: 'Polymer Composition', value: structureContext.value.polymer_composition || 'Not Specified' },
    {
      label: 'Selected Polymer Entity Types',
      value: formatListValue(structureContext.value.selected_polymer_entity_types)
    }
  ]
})

const structureContextRowsDisplay = computed(() => filterDisplayRows(structureContextRows.value))

const externalLinks = computed(() => {
  const links = resolvedRecord.value.external_links || {}
  return Object.entries(links).map(([label, href]) => ({
    label: label.toUpperCase().replace(/_/g, ' '),
    href
  }))
})

function getQueryParams() {
  const hash = window.location.hash
  const queryString = hash.includes('?') ? hash.split('?')[1] : ''
  const params = new URLSearchParams(queryString)
  return {
    code: params.get('code'),
    type: params.get('type')
  }
}

const groupMap = {
  'Alpha-helical polytopic': 'TRANSMEMBRANE PROTEINS:ALPHA-HELICAL',
  'Bitopic proteins': 'BITOPIC PROTEINS',
  'Beta-barrel transmembrane': 'TRANSMEMBRANE PROTEINS:BETA-BARREL',
  'All alpha monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'All beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha/Beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha + Beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha-helical peptides': 'TRANSMEMBRANE PROTEINS:ALPHA-HELICAL'
}

const mappedGroupName = computed(() => {
  const rawName = details?.value?.famsupclasstype_type_name
  return groupMap[rawName] || rawName || null
})

function handleHashChange() {
  const { code, type } = getQueryParams()
  if (code && type) {
    searchQuery.value = code
    searchType.value = type.toLowerCase()
  }
}

async function fetchRecord() {
  const query = searchQuery.value?.trim()
  if (!query || query.length < 3) {
    record.value = null
    details.value = null
    return
  }

  try {
    await dashboardStore?.getExpertAnnotation(query)
    record.value = dashboardStore.protein_details_new.data ?? null
    details.value = buildDetailsViewModel(record.value)
    error.value = null
  } catch (fetchError) {
    console.error('Error fetching expert annotation:', fetchError)
    record.value = null
    details.value = null
    error.value = fetchError
  }
}

function hideViewerLoaderAfterPaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      viewerLoading.value = false
    })
  })
}

function handleViewerLoaded() {
  hideViewerLoaderAfterPaint()
}

function handleGenericError() {
  tmViewerReady.value = false
  viewerLoading.value = false
}

function triggerGenericFallback(message) {
  viewerNotice.value = message
  tmViewerReady.value = false

  if (!forceGenericViewer.value) {
    forceGenericViewer.value = true
    viewerLoading.value = true
    return
  }

  viewerLoading.value = false
}

function handleTmFallback(message) {
  triggerGenericFallback(message)
}

function handleTmError(message) {
  if (opts.membraneOrientation && !forceGenericViewer.value) {
    const fallbackMessage =
      typeof message === 'string' && message.trim()
        ? `${message} Showing the generic structure view instead.`
        : 'The membrane-aware structure view could not be loaded, so the generic structure view is shown instead.'

    triggerGenericFallback(fallbackMessage)
    return
  }

  tmViewerReady.value = false
  viewerLoading.value = false
}

function handleTmLoaded() {
  tmViewerReady.value = true
  handleViewerLoaded()
}

function handleGenericLoaded() {
  tmViewerReady.value = false
  handleViewerLoaded()
}

async function syncDetailsPage() {
  const query = searchQuery.value?.trim()
  syncingDetailsPage.value = true

  if (!query || query.length < 3) {
    details.value = null
    record.value = null
    viewerLoading.value = false
    viewerNotice.value = ''
    forceGenericViewer.value = false
    tmViewerReady.value = false
    syncingDetailsPage.value = false
    return
  }

  try {
    viewerLoading.value = true
    viewerNotice.value = ''
    forceGenericViewer.value = false
    tmViewerReady.value = false
    await fetchRecord()

    if (!viewerPdbId.value) {
      viewerLoading.value = false
    }
  } finally {
    syncingDetailsPage.value = false
  }
}

watch([searchType, searchQuery], () => {
  if (!mountedReady.value) return
  syncDetailsPage()
})

watch(
  activeViewerRenderKey,
  () => {
    if (!mountedReady.value || syncingDetailsPage.value || !viewerPdbId.value) return
    if (!opts.membraneOrientation) {
      forceGenericViewer.value = false
      viewerNotice.value = ''
      tmViewerReady.value = false
    }
    viewerLoading.value = true
  }
)

onMounted(async () => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
  await syncDetailsPage()
  mountedReady.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
  viewerLoading.value = false
})
</script>

<style scoped>
.details-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.95fr);
  gap: 16px;
  margin-top: 16px;
  align-items: start;
}

.viewer-row {
  align-items: stretch;
}

.details-main-column,
.details-side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid #dce5ef;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 45, 90, 0.06);
}

.details-card--emphasis {
  background: linear-gradient(180deg, #f6fbff 0%, #eef6ff 100%);
  border-color: #b9d3ea;
}

.details-hero {
  padding: 24px;
}

.details-hero__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.details-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.section-eyebrow {
  margin: 0 0 6px;
  color: #56718f;
  font-size: 0.8rem !important;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.details-title,
.section-title {
  margin: 0;
  color: #17324d;
  font-weight: 700;
}

.details-title {
  font-size: 1.45rem !important;
}

.details-subtitle {
  margin: 8px 0 0;
  color: #5f748c;
  line-height: 1.5;
}

.section-header {
  margin-bottom: 14px;
}

.section-header--split {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.section-header__text {
  flex: 1 1 280px;
  min-width: 0;
}

.section-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 100%;
}

.details-subtitle--compact {
  margin-top: 6px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.meta-chip,
.pill-badge,
.pill-link {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.84rem !important;
  font-weight: 600;
  line-height: 1.1;
}

.meta-chip,
.pill-badge {
  background: #edf4fb;
  color: #184772;
}

.meta-chip--warning {
  background: #fff2e1;
  color: #8c4c0d;
}

.pill-link {
  background: #0f5ba7;
  color: #ffffff;
  text-decoration: none;
}

.pill-link:hover {
  color: #ffffff;
  background: #0c4c8b;
  text-decoration: none;
}

.overview-grid,
.definition-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.overview-item,
.definition-item {
  border-radius: 12px;
  padding: 12px 14px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.overview-label,
.definition-label,
.stacked-definition__label {
  display: block;
  color: #64809c;
  font-size: 0.78rem !important;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.overview-value,
.definition-value,
.stacked-definition__value {
  color: #1c3146;
  font-weight: 500;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.stacked-definition-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subsection-block {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #e7edf4;
}

.subsection-block--flush {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.stacked-definition {
  padding-bottom: 12px;
  border-bottom: 1px solid #e7edf4;
}

.tm-summary-lead {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.tm-summary-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  border-radius: 20px;
  background: #12395b;
  color: #ffffff;
  font-size: 2rem !important;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.tm-summary-title {
  color: #163450;
  font-size: 1.05rem !important;
  font-weight: 700;
  line-height: 1.35;
}

.tm-summary-description {
  margin-top: 8px;
  color: #56718f;
  line-height: 1.55;
}

.tm-summary-grid {
  margin-top: 16px;
}

.topology-track {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.topology-track__item {
  min-width: 116px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dce5ef;
  background: #ffffff;
}

.topology-track__item--membrane {
  background: #e8f4ea;
  border-color: #b8d6bf;
}

.topology-track__item--inside {
  background: #edf4fb;
  border-color: #c9ddf0;
}

.topology-track__item--outside {
  background: #fff5e8;
  border-color: #f0d8b5;
}

.topology-track__item--signal {
  background: #fff4db;
  border-color: #eed090;
}

.topology-track__label {
  color: #17324d;
  font-size: 0.78rem !important;
  font-weight: 700;
  text-transform: uppercase;
}

.topology-track__range {
  margin-top: 4px;
  color: #56718f;
  line-height: 1.35;
}

.stacked-definition:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.details-card--expert-review {
  overflow: hidden;
}

.definition-grid--compact {
  margin-top: 14px;
}

.stacked-definition-list--tight {
  gap: 10px;
}

.soft-alert--wrap,
.structure-note-preview,
.structure-note-preview__meta,
.structure-note-preview__chips,
.structure-note-preview .stacked-definition__label,
.structure-note-preview .stacked-definition__value {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.structure-note-preview--card {
  padding: 12px 14px;
  border: 1px solid #e4ebf4;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.structure-note-preview__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.structure-note-preview__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.details-card--expert-review :deep(.expert-note-trigger--button) {
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.details-card--expert-review :deep(.expert-note-trigger__label) {
  white-space: normal;
}

.function-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.function-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.sequence-block,
.taxonomy-tree {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.sequence-block {
  overflow: hidden;
}

.sequence-block :deep(.expandable-text) {
  display: block;
  line-height: 1.7;
  color: #1c3146;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.92rem !important;
}

.sequence-block :deep(.expandable-text__content) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.sequence-block :deep(.expand-toggle) {
  display: inline-block;
  margin-top: 10px;
}

.assessment-summary {
  border-radius: 12px;
  padding: 14px 16px;
  background: #eaf6ee;
  color: #1f5935;
  font-weight: 600;
  line-height: 1.5;
}

.assessment-summary--caution {
  background: #fff4e8;
  color: #8c4c0d;
}

.soft-alert {
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff8ec;
  color: #7b4d12;
  border: 1px solid #f1d4ab;
  line-height: 1.5;
}

.warning-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tm-boundary-table {
  border: 1px solid #dbe5ef;
}

.comparison-table {
  border: 1px solid #dbe5ef;
}

.comparison-table th {
  background: #edf4fb;
  color: #17324d;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.comparison-note {
  margin-top: 10px;
  color: #5f748c;
  font-size: 0.88rem !important;
  line-height: 1.5;
}

.tm-boundary-table th {
  background: #edf4fb;
  color: #17324d;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.production-card {
  border: 1px solid #d6dee8;
  border-radius: 10px;
  padding: 14px;
  height: 100%;
  background: #fbfdff;
}

.options-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border-color: #dce5ef !important;
}

.external-links {
  margin-top: 12px;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.viewer-shell {
  position: relative;
  flex: 1 1 auto;
}

.viewer-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
  /* padding: 16px; */
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border-color: #dce5ef !important;
}

.viewer-shell--landscape {
  height: 600px;
}

.viewer-shell--portrait {
  height: 760px;
}

.molstar-container {
  height: 100%;
}

.viewer-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 0.375rem;
}

.viewer-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #d8e6f5;
  border-top-color: #0d6efd;
  border-radius: 50%;
  animation: viewer-spin 0.9s linear infinite;
}

.viewer-loading-text {
  margin: 0;
  color: #234;
  font-weight: 600;
}

.topology-legend-panel {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #dce5ef;
}

.topology-legend-title {
  color: #17324d;
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.topology-legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topology-legend-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 0;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.topology-legend-note {
  margin: 10px 0 0;
  color: #56718f;
  font-size: 0.84rem;
  line-height: 1.5;
}

@keyframes viewer-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .options-panel {
    min-height: auto;
  }

  .viewer-panel {
    min-height: 400px;
  }

  .viewer-shell--landscape {
    height: 400px;
  }

  .viewer-shell--portrait {
    height: 520px;
  }

  .details-layout {
    grid-template-columns: 1fr;
  }

  .details-hero__header {
    flex-direction: column;
  }

  .details-hero__links {
    justify-content: flex-start;
  }

  .section-header--split {
    flex-direction: column;
    align-items: stretch;
  }

  .section-header__actions {
    width: 100%;
  }

  .details-card--expert-review :deep(.expert-note-trigger--button) {
    width: 100%;
    justify-content: center;
  }

  .overview-grid,
  .definition-grid {
    grid-template-columns: 1fr;
  }

  .tm-summary-lead {
    grid-template-columns: 1fr;
  }

  .tm-summary-count {
    min-height: 72px;
  }

  .molstar-container {
    height: 100%;
  }
}

@media (max-width: 480px) {
  .viewer-panel {
    min-height: 300px;
  }

  .viewer-shell--landscape {
    height: 300px;
  }

  .viewer-shell--portrait {
    height: 360px;
  }

  .molstar-container {
    height: 100%;
  }
}
/* Reduce cell spacing */
table {
  border-collapse: collapse; /* Removes extra spacing between cells */
  width: 100%; /* Ensures the table takes up the full width */
}

th,
td {
  padding: 2px; /* Adjust padding to reduce spacing */
  text-align: left; /* Align text to the left */
  border: 1px solid #ddd; /* Add a border for better visibility */
}

th {
  background-color: #f4f4f4; /* Add a light background for headers */
  font-weight: bold; /* Make headers bold */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* Add alternating row colors for readability */
}

tr:hover {
  background-color: #f1f1f1; /* Highlight row on hover */
}
* {
  font-size: 11pt !important;
}
.border-radius-none {
  border-radius: 0;
}

.v-treeview-node__root {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
}
.v-treeview-node__label {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
}

.anchor {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #007bff;
  text-decoration: none;
  transition:
    transform 0.2s,
    color 0.3s;
}

.anchor:hover {
  color: #0056b3;
  text-decoration: underline;
}

.anchor:active {
  transform: translateY(-3px) scale(1.1);
}

.anchor:hover iconify-icon {
  animation: bounce 0.5s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

.jump-animate {
  animation: jump 0.6s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.bouncing-badge {
  animation: bounce 1s infinite;
}

/* ===== 4-TAB DATABASE SECTION ===== */
.db-tabs-section { margin-top: 1.25rem; }

.db-tabs__nav {
  display: flex;
  gap: 2px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.db-tabs__tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.db-tabs__tab:hover        { color: var(--tab-color); }
.db-tabs__tab--active      { color: var(--tab-color); border-bottom-color: var(--tab-color); }

.db-tabs__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.42rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.db-tabs__body {
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: #fff;
}

.db-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.db-table__row:nth-child(even)  { background: #f8fafc; }
.db-table__row:hover            { background: #f1f5f9; transition: background 0.1s; }

.db-table__label {
  padding: 0.42rem 1rem;
  color: #64748b;
  font-weight: 500;
  width: 38%;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}
.db-table__value {
  padding: 0.42rem 1rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  word-break: break-word;
}


.track-segment--subunit {
  background-color: #ede9fe;
  border-color:     #7c3aed;
  color:            #3b0764;
}


/* ── Skeleton loader ───────────────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #edf2f7 25%,
    #e2e8f0 50%,
    #edf2f7 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-text   { height: 0.9em;  margin-bottom: 8px; }
.skeleton-text.w-40  { width: 40%; }
.skeleton-text.w-60  { width: 60%; }
.skeleton-text.w-80  { width: 80%; }
.skeleton-text.w-full { width: 100%; }
.skeleton-title  { height: 1.4em; width: 55%; margin-bottom: 12px; }
.skeleton-eyebrow{ height: 0.75em; width: 22%; margin-bottom: 8px; }
.skeleton-badge  { height: 28px; width: 90px; border-radius: 999px; display: inline-block; }
.skeleton-block  { height: 120px; width: 100%; border-radius: 10px; }
.skeleton-chip   { height: 28px; border-radius: 999px; }

/* grid of skeleton cells matching .overview-grid */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.skeleton-grid-item {
  border-radius: 12px;
  padding: 12px 14px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Empty state ───────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 32px;
  color: #64748b;
  min-height: 320px;
}
.empty-state-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  opacity: 0.5;
}
.empty-state h3 { color: #17324d; font-weight: 700; margin-bottom: 8px; }
.empty-state p  { max-width: 38ch; line-height: 1.6; }

/* ── Error banner ──────────────────────────────────────────────── */
.error-banner {
  border-radius: 12px;
  padding: 16px 20px;
  background: #fff0f3;
  border: 1px solid #fecdd3;
  color: #9f1239;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 16px;
}
.error-banner p { margin: 4px 0 0; font-weight: 400; color: #be123c; }

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; background: #e2e8f0; }
}

/* Fade between skeleton and loaded state */
.details-layout {
  transition: opacity 0.2s ease;
}


/* Row container for the four providers */
.related-provider-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Each provider + its dropdown */
.related-provider-wrapper {
  position: relative;
  display: inline-block;
}

/* Provider pill */
.related-provider-chip {
  cursor: pointer;
}

/* Dropdown: ensure it is above tables/cards and not clipped */
.related-provider-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 1px;
  min-width: 60px;
  z-index: 9999; /* large to avoid overlays */
  border-radius: 6px;
  background: var(--color-surface, #ffffff);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
  padding: 4px 0;
  z-index: 9999;
}

/* Items inside dropdown */
.related-provider-dropdown__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 6px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
}

.related-provider-dropdown__item:hover {
  background: rgba(148, 163, 184, 0.16);
}

.related-provider-dropdown__code {
  font-weight: 600;
}

.related-provider-dropdown__url {
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
  max-width: 40ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.db-tabs__body {
  position: relative;
  overflow: visible;
}

.db-table {
  position: relative;
  overflow: visible;
}

.db-table tbody {
  position: relative;
  overflow: visible;
}

.db-table__row {
  position: relative;
  overflow: visible;
}

.db-table__value {
  position: relative;
  overflow: visible;
}

.table-responsive {
  overflow: visible;
}

.details-card.db-tabs-section {
  position: relative;
  z-index: 10;
}




.opm-subunit-count {
  font-weight: 700;
  color: #17324d;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.opm-subunit-row {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.88rem;
  color: #1c3146;
  padding: 3px 0;
  border-bottom: 1px solid #f1f5f9;
  line-height: 1.6;
}

.opm-chain  { font-weight: 700; color: #0369a1; }
.opm-sep    { color: #64809c; }
.opm-tilt   { color: #166534; font-weight: 600; }
.opm-tm     { color: #7c3aed; }
.opm-seq-ctx{ color: #64809c; }


.topology-track__pagination {
  width: 100%;
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
/* ===== END ===== */
</style>
