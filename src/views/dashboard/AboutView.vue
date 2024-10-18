<template>
  <div class="main-content">
    <h1 class="mb-4">About</h1>
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="card-body">
            <div class="p-5">
              <h5>About MetaMP</h5>
              <p class="mb-10">
                MetaMP reveals the secrets of molecular structures through advanced analysis and visualization. We enhance MPstruc data with PDB insights to illuminate molecular interactions.
              </p>
              <!-- <h5>Our Mission</h5>
              <p class="mb-10">
                Our goal is to simplify complex molecular research. We aim to advance scientific understanding by uncovering the structural details of biomolecules.
              </p> -->
              <h5>What Sets Us Apart</h5>
              <p class="mb-10">
                MetaMP combines enriched MPstruc data with PDB information, offering a detailed view of molecular structures. This integration helps researchers explore biological macromolecules more deeply.
              </p>
              <h5>Key Features</h5>
              <div class="mb-10">
                <ul>
                  <li><strong>Analysis:</strong> Advanced tools for thorough examination of MPstruc data, including structural element identification and stability assessment.</li>
                  <li><strong>Validation:</strong> Robust mechanisms to ensure data accuracy and reliability, helping users make informed decisions.</li>
                  <li><strong>Visualization:</strong> Transforms complex data into intuitive visuals, facilitating easier interpretation and communication.</li>
                </ul>
              </div>
              <h5>Who Can Benefit</h5>
              <div class="mb-10">
                <ul>
                  <li><strong>Researchers:</strong> Gain deeper insights into molecular structures.</li>
                  <li><strong>Educators:</strong> Make complex concepts more accessible and engaging.</li>
                  <li><strong>Scientists:</strong> Speed up discoveries with validated and enriched data.</li>
                </ul>
              </div>
              <h5>Join Us</h5>
              <p class="mb-10">
                MetaMP is a vibrant community of researchers, scientists, and educators dedicated to structural biology. Join us in exploring new frontiers and advancing your research.
              </p>
              <p>
                Discover the hidden world of molecular structures with MetaMP and expand the possibilities of your research.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <h2 class="mb-4">Our Team</h2>
      </div>
      <div class="col-lg-3" v-for="(item, index) in profileList" :key="index">
        <ProfileCard :profile="item" />
      </div>
    </div>
  </div>
</template>
<script setup>
import ProfileCard from '../../components/common/ProfileCard.vue'
import { ref } from 'vue'

const profileList = ref([
  {
    _id: '6590a58c3feae9512146a57a',
    img: 'src/assets/image/ebenezer.jpeg',
    name: 'Awotoro Ebenezer',
    email: 'awotoroe@rki.de',
    position: 'Research Associate',
    institution: 'Robert Koch Institut'
  },
  {
    _id: '6590a58c7b776a0ff98f6393',
    img: 'src/assets/image/chisom.jpeg',
    name: 'Chisom Ezekannagha',
    email: 'ezekannaghac@rki.de',
    position: 'Postdoctoral researcher',
    institution: 'Robert Koch Institut'
  },
  {
    _id: '6590a58c7b776a0ff98f6394',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Florian Schwarz',
    email: '',
    position: '',
    institution: 'Freie Universität Berlin'
  },
  {
    _id: '6590a58c7b776a0ff98f6395',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Johannes Tauscher',
    email: '',
    position: '',
    institution: 'Freie Universität Berlin'
  },
  {
    _id: '6590a58c7b776a0ff98f6396',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Dominik Heider',
    email: '',
    position: 'Postdoctoral researcher',
    institution: 'Heinrich-Heine-Universität Düsseldorf'
  },
  {
    _id: '6590a58c7b776a0ff98f6397',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Katharina Ladewig',
    email: 'ladewigk@rki.de',
    position: 'Director at RKI',
    institution: 'Robert Koch Institut'
  },
  {
    _id: '6590a58c7b776a0ff98f6398',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Karine Moncoq',
    email: '',
    position: 'Postdoctoral researcher',
    institution: 'Institut de Biologie Physico-Chimique, CNRS'
  },
  {
    _id: '6590a58c7b776a0ff98f6399',
    img: 'src/assets/image/chisom.jpegs',
    name: 'Bruno Miroux',
    email: '',
    position: 'Postdoctoral researcher',
    institution: 'Institut de Biologie Physico-Chimique, CNRS'
  },
  {
    _id: '6590a58c7b776a0ff98f6393',
    img: 'src/assets/image/hattab.png',
    name: 'Georges Hattab',
    email: 'hattabg@rki.de',
    position: 'Supervisor',
    institution: 'Robert Koch Institut'
  },
])
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
