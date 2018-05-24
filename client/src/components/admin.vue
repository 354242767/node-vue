<template>
    <div class="adminContent main">
        <div class="">
            <input type="text" class="inp inp-search" placeholder="id" v-model="userId">
            <!-- <input type="text" class="" placeholder="用户名" v-model="username">
            <input type="text" class="" placeholder="电话号码" v-model="phoneNumber"> -->
            <input type="button" value="搜索" @click="queryAdmin()" class="btn btn-search">
            <input type="button" value="添加账号" @click="addAdminModel" class="btn btn-add ml-15">
        </div>
        <div class="">
            <my-table :table-arr="tableArr"></my-table>
            <ul class="pagination"> 
                <li v-if="nowPage!=1&&page>1"  @click="prePage">上一页</li>
                <!-- <li v-for="i in page">{{i}}</li> -->
                <!-- <li><input type="number"></li> -->
                <li v-if="nowPage!=page&&page>1" @click="nextPage">下一页</li>
                <li>共{{page}}页</li>
            </ul>
        </div>
    
        <model :is-show="isShow" @on-close="closeModel">
            <h3>账号编辑</h3>
            <p class="text-line">
                <span class="text-inline text-right text-80"> 用户名：</span>
                <input type="text" class="inp" v-model="addName">
                <span class="text-red">{{addNameErr.errorText}}</span> 
            </p>
            <p class="text-line">
                <span class="text-inline text-right text-80"> 密码：</span>
                <input type="text" class="inp"  v-model="addPassword">
                <span class="text-red"> {{addPasswordErr.errorText}}</span>
            </p>
            <p class="text-line">
                <span class="text-inline text-80"> </span>
                <input type="button" class="btn btn-green mr-15" value="确认" @click="addAdmin">
                <input type="button" class="btn btn-red" value="取消"  @click="closeModel">
            </p>
            <p>{{errorText}}</p>
        </model>    
           
    </div>
</template>

<script>
import myTable from './table'
import model from './model'
export default {
    data(){
        return{
            userId:'',
            username:'',
            phoneNumber:'',
            tableArr:{
                head:['编号','用户名','电话号码'],
                body:[]
            },
            totalAmount:0,
            preAmount:5,
            nowPage:1,
            //model
            isShow:false,
            //
            addName:'',
            addPassword:'',
            errorText:''
        }
    },
    components:{
        myTable,
        model
    },
    computed: {
    // a computed getter
        page: function () {
            // `this` points to the vm instance
            if(isNaN(this.totalAmount)) return 0;
            return Math.ceil(this.totalAmount/this.preAmount);
        },
        addNameErr(){
            let errorText,status
            if(!/^[A-Za-z0-9]{1,6}$/g.test(this.addName)){
                errorText='1-6位以内的数字和字母的组合';
                status=false;
            }else{
                errorText='';
                status=true;
            }
            //
            if(!this.usernameFlag){
              errorText=''
              this.usernameFlag=true
            }
            return {
              errorText,
              status
            }
        },
        addPasswordErr(){
            let errorText,status
            if(!/^\d{1,6}$/g.test(this.addPassword)){
                errorText='1-6位数字';
                status=false;
            }else{
                errorText='';
                status=true;
            }
            //
            if(!this.passwordFlag){
              errorText=''
              this.passwordFlag=true
            }
            return {
              errorText,
              status
            }
        }

    },
    mounted(){
        this.queryAdmin(1);
    
    },
    methods:{
        queryAdmin(page){
            var param={};
            if (this.userId!=='') {
                param['userId']=this.userId;
                // this.nowPage=1;
            }
            if(page){
                param['page']=page;
            }else{
                param['page']=1;
            }
            param['amount']=this.preAmount;
            this.$reqs.post("/admin/getAdmin",param)
                .then( (result) =>{ 
                    //成功
                    this.tableArr.body=result.data[0];
                    // console.log(this.tableArr);
                    this.totalAmount=result.data[1];
                   
                }).catch( (error) =>{
                    //失败
                    console.log(error);
                    
                });
        },
        nextPage(){
            this.queryAdmin(++this.nowPage);
        },
        prePage(){
            this.queryAdmin(--this.nowPage);
        },
        addAdminModel(){
            this.isShow=true;
        },
        closeModel(){
            this.isShow=false;
            this.addName='';
            this.addPassword='';
        },
        addAdmin(){
            if(!this.addNameErr.status||!this.addPasswordErr.status){
                this.errorText = '用户名或密码格式错误';
            }else{
                this.errorText = '';
                this.$reqs.post("/admin/addAdmin",{'username':this.addName,'password':this.addPassword,'phone':12345678910})
                .then( (result) =>{ 
                    //成功
                   console.log(result.data);
                   this.closeModel();
                   
                }).catch( (error) =>{
                    //失败
                   console.log(error);
                    
                }); 
            }
            
        }
        
    }
}
</script>

<style scoped>
    .main{
        padding:10px 15px;
    }
    .pagination li{
        display: inline-block;
        padding: 2px 10px;
        height: 18px;
        line-height: 20px;
        cursor: pointer;
    }
   
</style>

