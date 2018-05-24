<template>
    <div>
        <table>
            <thead>
                <tr>
                    <td  v-for="item in tableArr.head " @click="mySort(item)">{{item}}</td>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="item in tableArr.body ">
                     <td  v-for="i in item ">{{i}}</td>
                     
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  props:{
      tableArr:{
          type:Object,
          default:{
              head:[],
              body:[]
          }
      }
  },
  data(){
      return{}
  },
  methods:{
      mySort(item){
          console.log(_.orderBy())
            //   this.tableArr.body.sort(1);
      }
        
  }
}
</script>

<style scoped>
    table {
        margin: 20px 0 5px;
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #ddd;
        font-size: 14px;
        table-layout: fixed;
        word-wrap: break-all;
    }
    td {
        padding: 8px;
        text-align: left;
        vertical-align: middle;
        font-weight: normal;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #eee;
    }
    thead>tr{
        background-color: #e9eaec;
    }
    tbody>tr:nth-of-type(even) {
        background-color: #f9f9f9;
    }
    tbody>tr:hover{
        background-color: #f5f5f5;
    }
</style>
