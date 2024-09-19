const CoursePage = ({ params }: { params: { courseId: string } }) => {
  return <div>Course with id: {params.courseId}</div>;
};

export default CoursePage;
