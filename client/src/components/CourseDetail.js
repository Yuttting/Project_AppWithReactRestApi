// This component provides the "Course Detail" screen by retrieving the detail 
// for a course from the REST API's /api/courses/:id route and rendering the course. 
// The component also renders a "Delete Course" button that when clicked should 
// send a DELETE request to the REST API's /api/courses/:id route in order to delete a course. 
// This component also renders an "Update Course" button for navigating to the "Update Course" screen.

import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class CourseDetail extends Component {
    state = {
        course: [],
    }

    async componentDidMount() {
        //get detailed info of the selected course from api
        const { context } = this.props;
        context.data.getCourseDetail(this.props.match.params.id)
            .then(response => {
                this.setState({
                    course: response,
                })
            })
    }

    render() {
        //seperate a whole paragraph of needed materials into a list of things
        let arr;
        let material;
        if(this.state.course.materialsNeeded) {
            arr = this.state.course.materialsNeeded.split('*').filter(function(value){return value.length !== 0});
        }
        if(arr) {
            material = arr.map((item, index) => <li key={index}> {item} </li>);
        }

        //breake the description into several parapragh; easy to read
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
                        {/* if the user is logged in and is the owner of the course, 
                        show "update course" and "delete course" */}
                        {this.authenticated()}   
                    </div>
                </div>
            </div>
            
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{this.state.course.title}</h3>
                        {/* show course owner name */}
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

    // if the user is logged in and is the owner of the course, 
    // show "update course" and "delete course" 
    authenticated = () => {
        if (this.props.context.authenticatedUser && this.props.context.authenticatedUser.id === this.state.course.userId) {
            return (
                <span>
                    <Link className="button" to={`/courses/${this.state.course.id}/update`}>Update Course</Link>
                    {/* <a className="button" href="/">Delete Course</a> */}
                    <button className="button" onClick={this.delete}>Delete Course</button>
                    <Link className="button button-secondary" to="/">Return to List</Link>
                </span>
            )
        } else {
            return  <Link className="button button-secondary" to="/">Return to List</Link>
        }
    }

    //if the owner of the course is logged in, s/he can delete the course,
    //otherwise, redirect to 'forbidden' page
    delete = () => {
        const { context } = this.props;
        const courseId = this.props.match.params.id
        if (context.authenticatedUser){
            const {emailAddress, password} = context.authenticatedUser;
            //const password = context.unhashedPass;
            context.data.deleteCourse(courseId, emailAddress, password)
                .then( errors => {
                    
                    if (errors===null || errors.length === 0) {
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
        } else {
            this.props.history.push('/forbidden'); 
        }
    }
}

