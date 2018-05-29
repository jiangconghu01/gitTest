import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './comment.css';
import CommentInput from './CommentInput.js'
import CommentList from './CommentList.js'


class CommentApp extends Component{
    constructor(){
        super();
        this.state={
            comments:[]
        }
    }
    handleSubmitComment(comment){
        console.log(comment);
        this.state.comments.push(comment)
        this.setState({
            comments:this.state.comments
        })
    }
    render(){
        return (
        <div className="module-comment-box">
            <CommentInput onSubmit={this.handleSubmitComment.bind(this)}/>
            <CommentList comments={this.state.comments}/>
        </div>
        )
    }
}
export default CommentApp;
