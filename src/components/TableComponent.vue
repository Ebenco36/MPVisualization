<template>
    <div>
      <div class="table-header col-md-12">
        <div class="search-header">
          <input
            type="text"
            v-model="searchValue"
            placeholder="search ..."
            class="form-control"
          />
        </div>
        <div class="download-buttons">
          <i
            v-if="allowDownloads"
            class="download-button text-20 i-Down"
            @click="downloadCSV(items)"
          >
            CSV</i
          >
          <download-excel
            :data="items"
            :fields="headers"
            worksheet="Summary Statistics Workspace"
            name="summaryStatistics.xls"
            v-if="allowDownloads"
          >
            <i
              v-if="allowDownloads"
              class="download-button text-20 i-Down"
              @click="generateExcel(items)"
            >
              Excel</i
            >
          </download-excel>
        </div>
      </div>
      
      <div class="">
        <EasyDataTable
          :headers="headers ?? []"
          :items="items ?? []"
          :rows-per-page="rowsPerPage"
          :search-field="searchField"
          :search-value="searchValue"
          :current-page="currentPage"
          theme-color="#1d90ff"
          table-class-name="customize-table"
          header-text-direction="center"
          body-text-direction="center"
        />
      </div>
    </div>
  </template>
  <script>
  export default {
    props: {
      headers: {
        type: Array,
        required: true,
      },
      items: {
        type: Array,
        required: true,
      },
      rowsPerPage: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: false,
        default: 1
      },
      allowDownloads: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        searchField: "",
        searchValue: "",
      };
    },
    methods: {
      downloadCSV(data, fileName = "DataSheet.csv") {
        const csvContent = this.convertToCSV(data);
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
      convertToCSV(data) {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((obj) => Object.values(obj).join(","));
        return `${headers}\n${rows.join("\n")}`;
      },
    },
  };
  </script>
<style lang="scss">
  .customize-table {
    --easy-table-header-font-size: 14px;
    --easy-table-header-height: 50px;
    --easy-table-body-row-height: 50px;
    --easy-table-body-row-font-size: 14px;
    --easy-table-footer-font-size: 14px;
    --easy-table-footer-padding: 0px 10px;
    --easy-table-footer-height: 50px;
    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;
    --easy-table-rows-per-page-selector-z-index: 1;
    --easy-table-loading-mask-background-color: #2d3a4f;
  }
  
  .table-header {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .search-header {
    display: flex;
    align-items: center;
  }
  
  .search-button {
    margin-left: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .download-buttons {
    display: flex;
    align-items: center;
  }
  
  .download-button {
    border: 1px solid grey;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
  }
</style>