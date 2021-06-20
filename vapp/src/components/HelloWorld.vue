<template>


  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
            :src="require('../assets/ethereum.png')"
            class="my-3"
            contain
            height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Build CryptoStar DAPP
        </h1>

        <div v-if="dapp">
          You are connected with: <br/>
          {{ accounts }}
        </div>
        <div v-else>

          <v-dialog
              v-model="dappLoading"
              hide-overlay
              persistent
              width="300"
          >
            <v-card
                color="primary"
                dark
            >
              <v-card-text>
                Connecting to metamask, refresh the browser if metamask permission does not show...
                <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>

        </div>


      </v-col>

      <v-col
          class="mb-5"
          cols="12"
      >


        <v-row justify="center">
          <div class="text-center">
            <v-dialog
                v-model="dialogCreate"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="red lighten-2"
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                  Create a star
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Create your star
                </v-card-title>

                <v-card-text>
                  <v-text-field
                      label="Star Name"
                      v-model="starName"
                      hide-details="auto"
                  ></v-text-field>

                  <v-text-field
                      label="Star ID"
                      v-model="starID"
                      type="number"
                      hide-details="auto"
                  ></v-text-field>

                </v-card-text>


                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="onClickClaimStar"
                  >
                    Send your star
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-row>


      </v-col>

      <v-col>
        <v-row justify="center">
          <div class="text-center">
            <v-dialog
                v-model="dialog"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="green lighten-2"
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                  Lookup a star
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Look your star
                </v-card-title>

                <v-card-text>

                  <v-text-field
                      label="Star ID"
                      hide-details="auto"
                      type="number"
                      v-model="starID"
                  ></v-text-field>

                </v-card-text>


                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="onClickCheckStar"
                  >
                    Get info for this star TokenID
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-row>
      </v-col>


      <v-col class="mb-5"
             cols="12">
        <v-row justify="center">
          <div class="text-center">
            <v-dialog
                v-model="showError"
                width="500"
            >

              <v-card v-if="this.error">
                <v-card-title  class="headline grey lighten-2">
                  {{ this.error.code }}
                </v-card-title>

                <v-card-text>
                  {{ this.error.message }}
                </v-card-text>


                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="showError = false"
                  >
                    Quit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-row>
      </v-col>


      <v-col class="mb-5"
             cols="12">
        <v-row justify="center">
          <div class="text-center">
            <v-dialog
                v-model="showDetailStar"
                width="500"
            >

              <v-card v-if="this.showDetailStar">

                <v-card-text>
                  The name of your star is :
                  <h2>
                  {{ this.starDetail }}
                  </h2>
                </v-card-text>


                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="starDetail = showDetailStar = false"
                  >
                    Quit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-row>
      </v-col>

      <v-col
          class="mb-5"
          cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Version :
        </h2>

        <v-row justify="center">
          Truffle v5.2.6 (core: 5.2.6)
          <br/>
          Solidity - 0.8.0 (solc-js)
          <br/>
          Node v12.19.0
          <br/>
          Web3.js v1.2.9
          <br/>

        </v-row>
      </v-col>


    </v-row>
  </v-container>
</template>

<script>
import DApp from '../Dapp';
import {mapGetters} from 'vuex';


export default {
  name: 'HelloWorld',

  data: () => ({
    dialog: false,
    dialogCreate: false,
    dapp: false,
    dappLoading: true,
    accounts: null,
    starName: null,
    starID: null,
    on: false,
    error: null,
    showError: false,
    showDetailStar: false,
    starDetail: ""
  }),

  computed: {
    ...mapGetters([
      'isConnectionToEthereum',
      // ...
    ])
  },

  created: async function () {

    this.dapp = await DApp.init();

    this.dappLoading = this.dapp.loaded;
    this.accounts = this.dapp.accounts;


    console.log('created APP.vue');
    console.log(this.dapp);


    // console.log(this.$contract);
    // console.log(this.$test);
    console.log(this.$store.state.contract);
    // console.log(this.$data.test);
    // console.log(this);
    console.log('hello');

  },

  methods: {

    onClickCheckStar: async function () {
      console.log('on click check star');
      console.log(this.starID);
      this.starDetail = await this.dapp.checkStarInfo(this.starID);
      this.showDetailStar = true;
      this.dialog = false;
      this.starID = null;
    },

    onClickClaimStar: async function () {
      console.log('try to claim new star with');

      console.log(this.dapp);

      try {
        let result = await this.dapp.createStar(this.starName, this.starID);
        console.log(result.code);
      } catch (e) {
        console.log('error man');
        console.log(e);
        this.error = e;
        this.showError = true;
      }


      this.starName = null;
      this.starID = null;
      this.dialogCreate = false;

      // await this.dapp.claimStar(this.dapp.accounts[0]);
      // let starOwner = await this.dapp.checkStarOwner();
      // this.starOwner = starOwner;
      // await this.dapp.updateBalance();
    },

  }


}
</script>
