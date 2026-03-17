import { getCityAll } from "@/service";
import { defineStore } from "pinia";

const useCityStore = defineStore("city", {
  state: () => ({
    allCities: {},
    currentCity: {
      cityName: "景德镇"
    }
  }),
  actions: {
    async fetchAllCitiesData() {
      const res = await getCityAll()
      this.allCities = res.data.data
    }
  }
})

export default useCityStore
