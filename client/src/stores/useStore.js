import { defineStore } from 'pinia';

export const useStore = defineStore('useStore', {
  state: () => ({
    position:{
      lng: 0,
      lat:0
    }
  })
});
