import React, {Component} from 'react';

class Comment extends Component {
  render() {
    return (
      <div className="comment-box">
        <span className="user-name" title={this.props.comment.userName}>{this.props.comment.userName}:</span>
        <span className="user-content" title={this.props.comment.content}>{this.props.comment.content}</span>
      </div>
    );
  }
}
export default Comment;
