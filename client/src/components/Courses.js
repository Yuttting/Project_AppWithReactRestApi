import React, { Component } from 'react';
import Data from '../Data';
import NotFound from './NotFound';
import Course from './Course';

export default class Courses extends Component {
    state = {
        courses: [],
    }

    constructor() {
        super();
        this.data = new Data();
    }

    componentDidMount() {
       this.setState({courses: this.data.getCourses()})
    }

    render() {
        console.log(this.data.getCourses)
        //let allCourses = this.Data.getCourses();
        // if (this.courses) {
        //     allCourses = this.state.courses.map( course => 
        //     <Course
        //         key = {course.id}
        //         title = {course.title}
        //         url = {course.url}
        //     />
        //     )
        // } else {
        //     allCourses = <NotFound />
        // }
        //console.log(allCourses)
        return (
           <p>ff</p>
        )
    }
}