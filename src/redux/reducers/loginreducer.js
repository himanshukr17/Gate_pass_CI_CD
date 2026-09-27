// Rehydrate auth state from localStorage so page refresh doesn't log user out
const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('authState');
    if (serialized) return JSON.parse(serialized);
  } catch (e) {}
  return null;
};

const persistedAuth = loadAuthState();

const initialState = {
  isAuth: persistedAuth?.isAuth || false,
  details: persistedAuth?.details || "",
  isAdmin: persistedAuth?.isAdmin || 1,
  name: persistedAuth?.name || "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'PROFILE': {
      const nextState = { ...state, ...action.payload };
      // Persist to localStorage whenever auth changes
      try {
        localStorage.setItem('authState', JSON.stringify({
          isAuth: nextState.isAuth,
          details: nextState.details,
          isAdmin: nextState.isAdmin,
          name: nextState.name,
        }));
        if (!nextState.isAuth) {
          // On logout, clear persisted state
          localStorage.removeItem('authState');
        }
      } catch (e) {}
      return nextState;
    }
    default:
      return state;
  }
}