// store.js
import create from 'zustand';

const useStore = create((set) => ({
  inputTag: '',
  setInputTag: (text) => set({ inputTag: text }),
  inputTagValueText: '',
  setInputValueText: (text) => set({ inputTagValueText: text }),
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  activeTag: undefined,
  setActiveTag: (activeTag) => set({ activeTag }),
  selectedTags: [],
  setSelectedTags: (selectedTags) => set({ selectedTags }),
  resultInfo: {
    formula: '',
    output: ''
  },
  setResultInfo: (info) => set({ resultInfo: info })
}));

export { useStore };