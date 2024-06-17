<script>

import { BASEDATA, baseReload } from './baseManager'

const URL1 = () => `${BASEDATA}/tables/users`;

export default {
    name: 'User', 
    emits: ['user'],
    mounted() { this.reload() },
    data: function() {
          return { 
                heading: "Users",
                items: [],
                selected: { id: 0 },
                hide: true
              }
          },
    methods: {

        selectItem(item) { 
            this.selected = item
            this.$emit('user',item)  
            },

        reload() {
            baseReload(URL1()).then(
                (resp) => {this.items=resp ; console.log(resp)}

                ).catch(result => console.log(result) )
        },
    },
}
</script>
  
<template>
    <div>
       <div class="d-grid gap-2">
            <a  @click="hide = !hide">
                <i class="blue bi-folder-fill"></i>
                {{ heading }}</a>
        </div>
        <div v-if="!hide" v-for="item of items">
            <a @click="selectItem(item)" >
            <span :class="{ 'red' : selected.id === item.id}">
                <i class="blue bi-building"></i>
                {{ item.username }}
            </span> 

            </a>
        </div>
        <div >
            <a @click="selectItem({id:0,username:'all'})" >
            <span :class="{ 'red' : selected.id == 0}">
                <i class="blue bi-building"></i>
                all
            </span> 
            </a>
        </div>
    </div>
</template>