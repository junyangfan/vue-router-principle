class HistoryRoute{
    constructor(){
        this.current = null
    }
}
class VueRouter{
    constructor(options){
        // console.log(options);   //{mode: "hash", routes: Array(2)}
        this.mode = options.mode || 'hash'
        this.routes = options.routes || []
        this.routesMap = this.createMap(this.routes)
        // console.log(this.routerMap);
        this.history = new HistoryRoute()
        this.init()
    }
    //刷新页面就会调用
    init(){
        // console.log('**************');
        if(this.mode === 'hash'){
            //使用的是hash路由
            // console.log('使用的是hash路由');
            location.hash ? "" : location.hash = '/'
            // console.log(location.hash);  //#/    使用hash会自动加上#号
            window.addEventListener('load',()=>{
                this.history.current = location.hash.slice(1)
                // console.log('load---->',this.history.current);  //load----> /
            })
            window.addEventListener('hashchange',()=>{
                this.history.current = location.hash.slice(1)
                // console.log('hishchange--->',this.history.current);
            })
        }else{
            //使用的是history
            // console.log('使用的是history路由');
            // console.log(location.pathname);
            location.pathname ? '' : location.pathname = '/'
            window.addEventListener('load',()=>{
                this.history.current = location.pathname
                console.log('load---->',this.history.current)
            })
            window.addEventListener('popstate',()=>{
                this.history.current = location.pathname
                console.log('popstate--->',this.history.current)
            })
        }
    }
    push(){}
    go(){}
    back(){}
    //可以把数组结构转化成对象结构
    createMap(routes){
        return routes.reduce((memo,current)=>{
            // memo 刚开始是一个空对象
            memo[current.path] = current.component
            return memo;
        },{})
    }
}

//install方法中第一个参数就是Vue构造器
VueRouter.install = function(Vue){
    // console.log(Vue);   //Vue构造器
    //当使用Vue.use(Vue-router)时，调用install方法
    //Vue.component()   //全局组件
    Vue.mixin({
        //给每个组件混入一个beforeCreate
        beforeCreate(){
            // console.log(this.$options.name);
            //获取根组件
            if(this.$options && this.$options.router){
                //找到根组件
                //把当前的实例挂载到_root上面
                this._root = this   //main根组件
                //把router实例挂载到_router上
                this._router = this.$options.router
                //监控路径变化，路径变化就刷新视图 
                Vue.util.defineReactive(this,'xxx',this._router,history)    //这行代码可以给我们的history设置get和set，使history变成响应式
            }else{  // main ----> app    --->  Home/About   所有组件中都是有router
                this._root = this.$parent._root;
                this._router = this.$parent._router;
            }

            // this.$options.name 获取组件的名字
            // console.log(this.$options.name)
            Object.defineProperty(this,"$router",{
                get(){
                    return this._root._router;
                }
            })
            Object.defineProperty(this,"$route",{
                get(){
                    // console.log(this._root._router.history);
                    return{
                        current:this._root._router.history.current
                    }
                }
            })
        }
    })
    Vue.component('router-link',{
        props: {
            to:String
        },
        render(h){
            let mode = this._self._root._router.mode;
            return <a href={mode==='hash'?`#${this.to}`:this.to}>{this.$slots.default}</a>
        }
    })
    Vue.component('router-view',{
        render(h){
            let current = this._self._root._router.history.current;
            let routesMap = this._self._root._router.routesMap;
            return h(routesMap[current])
        }
    })
}

export default VueRouter