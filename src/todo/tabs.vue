<template>
    <div class="helper">
        <span class="left">{{unFinishedTodoLength}} item left</span>
        <span class="tabs">
            <span
                    v-for="state in states"
                    :key="state"
                    :class="[state, filter === state ? 'actived' : '']"
                    @click="toggleFilter(state)"
            >
                {{state}}
            </span>
        </span>
        <span class="clear" @click="clearAllCompleted()">
            Clear Completed
        </span>
    </div>
</template>

<script>
export default {
    // props 接收父组件传过来的值
    props:{
        filter: {
            type: String,
            required: true,
        },
        todos: {
            type: Array,
            required: true
        }
    },
    methods:{
        toggleFilter(state){
            this.$emit('toggle', state);
        },
        clearAllCompleted() {
            this.$emit('clearAllCompleted');
        }
    },
    //Vue中computed就是 实时计算 使用。Vue检测到数据发生变动时就会执行对相应数据有引用的函数。
    computed: {
        unFinishedTodoLength() {
            return this.todos.filter(todo => !todo.completed).length;
        }
    },
    data(){
        return {
            states: ['all', 'active', 'completed']
        }
    }
}
</script>

<style lang="stylus" scoped>
    .helper {
        font-weight 100
        display flex
        justify-content space-between
        padding 5px 0
        line-height 30px
        background-color #ffffff
        font-size 14px
        font-smoothing: antialiased;
    }
    .left, .clear, .tabs {
        padding 0 10px
        box-sizing border-box
    }
    .left, .clear {
        width 150px
    }
    .left {
        text-align left
    }
    .clear {
        text-align: right
        cursor pointer
    }
    .tabs {
        width 200px
        display flex
        justify-content space-around
        * {
            display inline-block
            padding 0 10px
            cursor pointer
            border 1px solid rgba(175, 47, 47, 0)
            &.actived {
                border-color rgba(175, 47, 47, 0.4)
                border-radius 5px
            }
        }
    }
</style>