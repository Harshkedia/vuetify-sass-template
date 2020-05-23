/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    totalCost: 10000,
    programs: [
      { name: "Infusion", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 },
      { name: "Physician Services", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 },
      { name: "Radiation Oncology", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 },
      { name: "Imaging/Diagnostics", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 },
      { name: "PH, Lab, Support", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 },
      { name: "Lob, Res, Ctr, ED, Off", units: 1, gsf: 100, sqft: 100, cost: 10, totalCost: 1000 }
    ]
  },
  mutations: {
    setProgramUnits(state, payload) {
      state.programs.forEach(program => {
        if (program.name === payload.name) {
          program.units = payload.val;
          program.sqft = program.units * program.gsf;
          program.totalCost = program.sqft * program.cost;
        }
      });
      state.totalCost = state.programs.reduce((acc, program) => {
        return acc + program.totalCost;
      }, 0);
    },
    setProgramGSF(state, payload) {
      state.programs.forEach(program => {
        if (program.name === payload.name) {
          program.gsf = payload.val;
          program.sqft = program.units * program.gsf;
          program.totalCost = program.sqft * program.cost;
        }
      });
      state.totalCost = state.programs.reduce((acc, program) => {
        return acc + program.totalCost;
      }, 0);
    },
    setProgramCost(state, payload) {
      state.programs.forEach(program => {
        if (program.name === payload.name) {
          program.cost = payload.val;
          program.totalCost = program.sqft * program.cost;
        }
      });
      state.totalCost = state.programs.reduce((acc, program) => {
        return acc + program.totalCost;
      }, 0);
    }
  },
  actions: {},
  modules: {},
  getters: {
    programs(state) {
      return state.programs;
    },
    totalCost(state) {
      return state.totalCost;
    }
  }
});
