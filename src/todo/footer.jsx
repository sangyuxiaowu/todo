import '../assets/styles/footer.styl'

export default{
    data(){
        return{
            author:"marin1993"
        }
    },
    render(){
        return (
            <div id="footer">
                <span>Power by {this.author}</span>
            </div>
        )
    }
}