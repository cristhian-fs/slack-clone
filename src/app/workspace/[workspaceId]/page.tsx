interface WorkspacePageProps {
  params:{
    workspaceId: string
  }
}

const WorkspacePage = ({ params }: WorkspacePageProps) => {
  return ( 
    <div>
      Id: {params.workspaceId}
    </div>
   );
}
 
export default WorkspacePage;