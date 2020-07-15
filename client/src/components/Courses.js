import React, { Component } from 'react';
import NotFound from './NotFound';
import Course from './Course';


export default class Courses extends Component {
    
    state = {
        courses: []
    };

    async componentDidMount() {
        const { context } = this.props;
        context.data.getCourses()
            .then(response => {
                this.setState({
                    courses: response
                })
            })
      }

    render() {
        let allCourses;

        if (this.state.courses.length>0) {
            allCourses = this.state.courses.map( (course) => 
            <Course
                key = {course.id}
                title = {course.title}
                url = {`/courses/${course.id}/`}
            />
            );
        } else {
            allCourses = <NotFound />
        }

        return (
            <div className="bounds"> 
                {allCourses}
                <div className="grid-33">
                    <a className="course--module course--add--module" href="create-course">
                        <h3 className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                        </svg>
                        New Course</h3>
                    </a>
                </div>
            </div>
           
        )
    }
}