"use client"
import { useParams } from 'next/navigation';

import FileLists from '../../_components/FileLists';
import Folders from '../../_components/Folders'

const FolderPage = () => {
const params = useParams();
const folderId = params?.folderId
  ? Number(params.folderId)
  : undefined;


  return (
    <div className="flex flex-col gap-4 mb-10">
      <Folders folderId={folderId}/>

      <FileLists folderId={folderId} />
    </div>
  )
}

export default FolderPage