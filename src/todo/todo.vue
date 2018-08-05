<template>
    <section class="real-app">
        <input
            type="text"
            class="add-input"
            autofocus="autofocus"
            placeholder="接下来要去做什么？"
            @keyup.enter="addTodo"
        >
        <!-- 使用items组件 -->
        <!-- :todo="todo" 往子组件item.vue 传入todo对象
             v-for="todo in filteredTodos" 遍历 todos 数组
             @del="deleteTodo" 接收子组件要触发的del方法
        -->
        <Item 
            :todo="todo"
            v-for="todo in filteredTodos"
            :key="todo.id"
            @del="deleteTodo"></Item>
            
        <!--
            用 key 管理可复用的元素
            Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。
            这么做除了使 Vue 变得非常快之外，还有其它一些好处。
        -->

        <Tabs 
            :filter="filter" 
            :todos="todos" 
            @clearAllCompleted="clearAllCompleted" 
            @toggle="toggleFilter"
        ></Tabs>
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
 let id = 0;
export default {
    data(){
        return{
            todos:[],
            filter:'all'
        }
    },
    components:{
        Item,
        Tabs
    },
    computed:{
        filteredTodos(){
            if(this.filter==='all'){
                return this.todos
            }
            const completed = this.filter ==='completed'
            // 将todos数组中，completed为true的值过滤出来，并返回一个新数组
            return this.todos.filter(todo => completed === todo.completed);
        }
    },
    methods:{
        addTodo(e){
            //unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
            this.todos.unshift({
                id: id++,
                content:e.target.value.trim(),
                completed:false
            })
            e.target.value = ''
        },
        deleteTodo(id){
            //splice() 方法向/从数组中添加/删除项目,然后返回被删除的项目。 注释:该方法会改变原始数组。
            //其中的 1 是要删除的项目数量。如果设置为 0，则不会删除项目
            //findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
            //findIndex() 方法为数组中的每个元素都调用一次函数执行：
            //当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数
            //如果没有符合条件的元素返回 -1
            //注意: findIndex() 对于空数组，函数是不会执行的。
            //注意: findIndex() 并没有改变数组的原始值。
            //该写法为 函数嵌套
            this.todos.splice(this.todos.findIndex(todo => todo.id === id),1)
        },
        clearAllCompleted() {
            // 给todos赋一个新的值（即todo.completed为false的值）
            // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
            // 注意： filter() 不会对空数组进行检测。
            // 注意： filter() 不会改变原始数组。
            this.todos = this.todos.filter(todo => todo.completed === false)
        },
        toggleFilter(state){
            this.filter = state
        }
    }
}
</script>

<style lang="stylus" scoped>
    .real-app {
        width 600px
        margin 0 auto
        box-shadow 0 0 5px #666
    }
    .add-input {
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 36px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
</style>
