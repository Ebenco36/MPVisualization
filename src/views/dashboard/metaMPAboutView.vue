<template>
    <div class="main-content">
      <h1 class="mb-4">About MetaMP</h1>
      <div class="row">
        <div class="col-md-12 p-0">
          <div class="card mb-4 p-0">
            <div class="card-body p-0">
              <div class="p-4 text-justify">
              <h5>About MetaMP: Unveiling the Power of Structural Insight</h5>
              <p class="mb-10">
                MetaMP is a web-based platform designed to curate and enhance membrane protein structures through the integration of diverse databases as described in the table below. The application offers interactive visualizations that present summary statistics for various attributes and incorporates machine learning algorithms to assist researchers in classifying membrane protein structures into their appropriate groups, as well as identifying outliers.
              </p>
  
              <!-- <h5>Our Mission: Bridging Understanding through Structure</h5>
              <p class="mb-10">
                MetaMP is driven by a singular mission — to bridge the gap between complexity and
                comprehension in molecular research. We believe that unraveling the structural nuances
                of biomolecules is key to advancing scientific understanding and innovation.
              </p> -->
              <div class="row">
              <div class="col-md-6 col-lg-6">
                <!-- <div class="card o-hidden mb-4">
                  <div class="card-body">
                    <div class="card-title"><div class="text-muted text-center">Database Summary</div></div>
                    </div>
                    <p class="card-text">
                    <ul class="list-group list-group-flush font-weight-bold">
                        <li class="list-group-item">Reports of membrane protein structures in database: {{
                            numeral(aboutStore?.about_data?.data?.all_data?.total_rows).format('0,0') }}</li>
                        <li class="list-group-item">Unique proteins in database: {{
                            numeral(aboutStore?.about_data?.data?.get_master_proteins?.total_rows).format('0,0') }}
                        </li>
                        <li class="list-group-item">Reports of membrane protein structures from <strong>OPM:</strong> {{
                            numeral(aboutStore?.about_data?.data?.all_data_opm?.total_rows).format('0,0') }}</li>
                        <li class="list-group-item">Reports of membrane protein structures from
                            <strong>UniProt:</strong> {{
                                numeral(aboutStore?.about_data?.data?.all_data_uniprot?.total_rows).format('0,0') }}
                        </li>

                    </ul>
                    </p>
                </div> -->

                <div class="card o-hidden mb-4">
                  <div class="card-body">
                    <div class="card-title"><div class="text-muted text-center">Summary of the datasets, including the number of observations, nominal and quantitative attributes</div></div>
                    </div>
                    <div class="card-text" style="overflow: auto;">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Database</th>
                            <th>Observations</th>
                            <th>Attributes</th>
                            <th>Nominal</th>
                            <th>Quantitative</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>MPstruc</td>
                            <td>{{ numeral(aboutStore?.about_data?.data?.all_data_mpstruc?.total_rows).format('0,0') }}</td>
                            <td>10</td>
                            <td>10</td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>PDB</td>
                            <td> {{ numeral(aboutStore?.about_data?.data?.all_data_pdb?.total_rows).format('0,0') }}</td>
                            <td>228</td>
                            <td>92</td>
                            <td>136</td>
                          </tr>
                          <tr>
                            <td>OPM</td>
                            <td>{{ numeral(aboutStore?.about_data?.data?.all_data_opm?.total_rows).format('0,0') }}</td>
                            <td>27</td>
                            <td>19</td>
                            <td>8</td>
                          </tr>
                          <tr>
                            <td>UniProtKb</td>
                            <td>{{ numeral(aboutStore?.about_data?.data?.all_data_uniprot?.total_rows).format('0,0') }}</td>
                            <td>4</td>
                            <td>4</td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td><strong>MetaMP</strong></td>
                            <td>{{ numeral(aboutStore?.about_data?.data?.all_data?.total_rows).format('0,0') }}</td>
                            <td>269</td>
                            <td>125</td>
                            <td>144</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>

              <div class="col-lg-6 col-md-6">
                <div class="mb-4">
                  <div class="p-0">
                    <GraphView id="trends_by_database_year"
                      :summary="aboutStore?.about_data?.data?.trends_by_database_year" />
                  </div>
                </div>
              </div>
            </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import GraphView from '@/components/dashboard/GraphView.vue'
  import { useAboutStore } from '@/stores/about.js'
  import numeral from 'numeral';
  
  const aboutStore = useAboutStore()
  
  onMounted(() => {
    aboutStore?.loadAboutPage()
  })
  </script>
  <style scoped>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  .p-4{
    padding: 2.0rem !important
  }
  </style>
  