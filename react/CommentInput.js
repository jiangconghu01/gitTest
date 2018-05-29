import React,{Component} from 'react';

class CommentInput extends Component{
    constructor(){
        super();
        this.state={
            userName:'',
            content:''
        }
    }
    bindNameInput(e){
        this.setState({
            userName:e.target.value
        })
    }
    bindContentInput(e){
        this.setState({
            content:e.target.value
        })
    }
    handleSubmit(){
        if(this.props.onSubmit){
            const {userName,content} =this.state;
            this.props.onSubmit({userName,content})
        }
        this.setState({
            content:''
        })
    }
    enterEvent(e){
        if(e.keyCode===13){
            this.handleSubmit();
        }
    }
    render(){
        return(
            <div className="module-input-box">
                <div className="input-box ">
                    <span>用户名：</span>
                    <input value={this.state.userName} onInput={this.bindNameInput.bind(this)}/>
                </div>
                <div className="textarea-box">
                    <span>评论内容：</span>
                    <textarea value={this.state.content} onChange={this.bindContentInput.bind(this)} onKeyUp={this.enterEvent.bind(this)}></textarea>
                </div>
                <div className="button-box">
                    <button onClick={this.handleSubmit.bind(this)}>发布</button>
                </div>
            </div>
        )
    }
}
export default CommentInput;
