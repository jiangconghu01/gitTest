import React,{Component} from 'react';
import Comment from './Comment.js';
class CommentList extends Component{
    render(){
        return (
            <div className="module-content-box">
               {this.props.comments.map((comment,i)=>{
                   return (
                        <Comment key={i} comment={comment}/>
                   )
               })} 
            </div>
        )
    }
}
export default CommentList;
