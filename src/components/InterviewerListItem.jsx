import React from 'react';
import classnames from "classnames";
import "components/InterviewerListItem.scss";


const InterviewerListItem = (props) => {

  const InterviewerListItemClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  const imgClass = classnames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  });

  return (
  <li
    className={InterviewerListItemClass}
    id={props.id}
    name={props.name}
    onClick={() => props.setInterviewer(props.name)}
  >
    <img
      className={imgClass}
      src={props.avatar}
      alt={props.name}
    />
    {props.name}
  </li>
  );
};

export default InterviewerListItem;