import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        contract: null,
        commitActions : {
            SAVE_CONTRACT: 'saveContract',
        }
    },
    mutations: {
        async saveContract ( state, contract) {
            state.contract = contract;
        },

    }
})
