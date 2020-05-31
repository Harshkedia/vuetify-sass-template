/* eslint-disable no-param-reassign */
function update(state) {
  // Update Program SQFT
  state.optionA.programs.forEach(program => {
    program.sqft = program.gsf * program.units;
    program.totalCost = program.sqft * program.cost;
  });
  state.optionB.programs.forEach(program => {
    program.sqft = program.gsf * program.units;
    program.totalCost = program.sqft * program.cost;
  });

  // Update Total Cost
  state.optionA.totalCost = state.optionA.programs.reduce((acc, program) => {
    return acc + program.totalCost;
  }, 0);
  state.optionB.totalCost = state.optionB.programs.reduce((acc, program) => {
    return acc + program.totalCost;
  }, 0);

  // Update TotalSQFT
  state.optionA.totalSqft = state.optionA.programs.reduce((acc, program) => {
    return acc + program.sqft;
  }, 0);
  state.optionB.totalSqft = state.optionB.programs.reduce((acc, program) => {
    return acc + program.sqft;
  }, 0);

  // Update Total Occupancy Cost
  state.optionA.totalOccupancyCost = state.optionA.totalSqft * state.optionA.occupancyCost;
  state.optionB.totalOccupancyCost = state.optionB.totalSqft * state.optionB.occupancyCost;
}

export default {
  setProgramUnits(state, payload) {
    if (payload.optionName === "OptionA") {
      state.optionA.programs.forEach(program => {
        if (program.name === payload.name) {
          program.units = payload.val;
        }
      });
    } else {
      state.optionB.programs.forEach(program => {
        if (program.name === payload.name) {
          program.units = payload.val;
        }
      });
    }
    update(state);
  },
  setProgramGSF(state, payload) {
    if (payload.optionName === "OptionA") {
      state.optionA.programs.forEach(program => {
        if (program.name === payload.name) {
          program.gsf = payload.val;
        }
      });
    } else {
      state.optionB.programs.forEach(program => {
        if (program.name === payload.name) {
          program.gsf = payload.val;
        }
      });
    }
    update(state);
  },
  setProgramCost(state, payload) {
    if (payload.optionName === "OptionA") {
      state.optionA.programs.forEach(program => {
        if (program.name === payload.name) {
          program.cost = payload.val;
        }
      });
    } else {
      state.optionB.programs.forEach(program => {
        if (program.name === payload.name) {
          program.cost = payload.val;
        }
      });
    }
    update(state);
  },
  setOccupancyCost(state, payload) {
    if (payload.optionName === "OptionA") {
      state.optionA.occupancyCost = payload;
    } else {
      state.optionB.occupancyCost = payload;
    }
    update(state);
  }
};
