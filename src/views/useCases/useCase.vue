<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'

</script>
<style lang="scss"></style>

<template>
    <div class="main-content">
        <HeaderCrumbs label="AI MetaMP Use-cases" title="" />

        <div class="row">
  <div class="col-md-12">
    <p class="text-center text-medium-emphasis">
      MetaMP is a versatile tool designed to assist in various use-cases, including:
    </p>
    <div class="row">
      <div class="col-md-6 d-flex">
        <v-card class="d-flex flex-column h-100 w-100">
          <v-card-text class="flex-grow-1">
            <p class="text-h4 font-weight-black">Transmembrane Segments Prediction</p>
            <div class="text-medium-emphasis">
              <p>
                MetaMP integrates state-of-the-art deep learning models (TMbed + DeepTMHMM) to
                predict the number, type, and position of transmembrane segments.
                The results are reconciled and stored in a unified format, enabling rapid
                comparison and large-scale screening of membrane protein topologies across
                diverse datasets.
              </p>
              <p>
                This enables accurate mapping of protein topology across the membrane,
                supporting both alpha-helical and beta-barrel membrane proteins.
              </p>
            </div>
          </v-card-text>

          <v-card-actions>
            <router-link :to="{ name: 'ai-prediction' }">
              <v-btn color="blue" text="View" variant="text"></v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </div>

      <div class="col-md-6 d-flex">
        <v-card class="d-flex flex-column h-100 w-100">
          <v-card-text class="flex-grow-1">
            <p class="text-h4 font-weight-black">Topology-Based Classification</p>
            <div class="text-medium-emphasis">
              <p>
                MetaMP uses numerical and categorical features (e.g., tilt, thickness, subunit
                segments) to classify membrane proteins into key structural groups:
              </p>
              <ul class="container">
                <li>Alpha-helical transmembrane proteins</li>
                <li>Beta-barrel membrane proteins</li>
                <li>Monotopic membrane proteins</li>
              </ul>
              <p>
                Powered by supervised and semi-supervised learning, predictions are visualized
                with dimensionality reduction techniques like PCA, UMAP, and t-SNE for
                transparency and interpretability.
              </p>
            </div>
          </v-card-text>

          <v-card-actions>
            <router-link :to="{ name: 'machine-learning-prediction-' }">
              <v-btn color="blue" text="View" variant="text"></v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</div>
        
    </div>
</template>
