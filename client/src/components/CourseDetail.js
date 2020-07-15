import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class CourseDetail extends Component {
    state = {
        course: [],
    }

    async componentDidMount() {
        const { context } = this.props;
        context.data.getCourseDetail(this.props.match.params.id)
            .then(response => {
                this.setState({
                    course: response,
                })
            })
    }

    render() {

        let arr;
        let material;
        if(this.state.course.materialsNeeded) {
            arr = this.state.course.materialsNeeded.split('*').filter(function(value){return value.length !== 0});
        }
        if(arr) {
            material = arr.map((item, index) => <li key={index}> {item} </li>);
        }

        let paragraph;
        let description;
        if(this.state.course.description) {
            paragraph = this.state.course.description.split('\n');
        }
        if(paragraph) {
            description = paragraph.map((p,index) => <span key={index}>{p}</span>)
        }
        
        return (
            <div>
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`/courses/${this.state.course.id}/update-course`}>Update Course</Link>
                            {/* <a className="button" href="/">Delete Course</a> */}
                            <button className="button" onClick={this.delete}>Delete Course</button>
                        </span>
                            <Link className="button button-secondary" to="/">Return to List</Link></div>
                </div>
            </div>
            
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{this.state.course.title}</h3>
                        <p>By {this.state.course.User? this.state.course.User.firstName : ''} {this.state.course.User? this.state.course.User.lastName : ''}</p>
                    </div>
                    <div className="course--description">
                    <p>{description}</p>
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <h3>{this.state.course.estimatedTime}</h3>
                            </li>
                                <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <ul>
                                    {material}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        )
    }

    delete = () => {
        const { context } = this.props;
        const id = this.props.match.params.id
        if (context.authenticatedUser){
            const { password, emailAddress } = context.authenticatedUser;
            context.data.deleteCourse(id, emailAddress, password)
                .then( errors => {
                    if (errors && errors.length === 0) {
                        this.props.history.push('/'); 
                    } else {
                        this.setState({ errors });
                        this.props.history.push('/forbidden'); 
                    }
                  })
                .catch((err) => {
                    console.log(err);
                    this.props.history.push('/error')
                })
        } 
    }
}

