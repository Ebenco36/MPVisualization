<template>
  <div :style="{ marginTop: divHeight + 'px' }"></div>
  <div class="app-footer" ref="myDiv">
    <div class="row">
      <div class="col-md-12">
        <div class="footer-bottom ">
          <span class="flex-grow-1"></span>
          <div class="d-flex align-items-center">
            <div style="text-align: center;">
              <p class="m-0">Copyright | &copy; {{ year }} <strong>MetaMP</strong></p>
              <p>All rights reserved</p>
              <LoaderComponent />
              <PageTracking pageTitle="home" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import LoaderComponent from "@/components/LoaderComponent.vue";
import PageTracking from '@/components/common/PageTracker.vue';

const myDiv = ref(null);
const divHeight = ref(0);

const d = new Date();
const year = d.getFullYear();

onMounted(() => {
  if (myDiv.value) {
    divHeight.value = myDiv.value.clientHeight + 10; // 10 is added as padding
    console.log('Div height:', divHeight.value);
  }
});

</script>
<style scoped>
.app-footer {
  background-color: #f1f1f1;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
}

/* .seperate-groups{
  margin-top: 200px;
} */

.footer-bottom .d-flex {
  justify-content: center;
}
</style>