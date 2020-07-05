import React from 'react';

const Course = ({key, title}) => {
    return (
        <div className="bounds">
            <div className="grid-33">
                <a className="courses--module course--link" href={`/courses/${key}/`}/>
                    <h4 className="course--label">Course</h4>
                    <h2 className="course--title">{title}</h2>
            </div>
            <div className="grid-33">
                <h3 className="course--add-title">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" class="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>
                New Course
                </h3> 
            </div>
        </div>
    )
}

export default Course;
  
