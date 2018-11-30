const initialState = {
	SyncedGroups: "etst"
};

// Define Action Types
const CREATE_GROUP_DATA_SYNC = 'CREATE_GROUP_DATA_SYNC';

// Define Action Creators 
export const createGroupDataSync = (data) => ({ type: CREATE_GROUP_DATA_SYNC, payload: data,});

// Define Root Reducers
export default (state = initialState, action) => {
  const { type, payload, key } = action;
  console.log(state);
  switch (type) {
    case CREATE_GROUP_DATA_SYNC:
    	console.log("CREATE_GROUP_DATA_SYNC");
      return state;
    default:
      return state;
  }

};