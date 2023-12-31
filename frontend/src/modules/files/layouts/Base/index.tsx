import {
  Button,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import FileIcon from '@mui/icons-material/Description'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useState } from 'react'
import { detailFileNodesThunk } from '../../store/thunks/detail'

export const BaseLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { nodes, selectedNode, detailNode } = useAppSelector((s) => s.fileNodes)
  const [isFileOpen, setIsFileOpen] = useState(false)
  const openFile = (nodeId: string) => {
    setIsFileOpen(true)
    dispatch(detailFileNodesThunk(nodeId))
  }

  const nodeList = selectedNode?.parentId ? selectedNode.children : nodes
  return (
    <Grid container>
      <Grid item sm={2}>
        <Link to="/dashboard">
          <Button>Home</Button>
        </Link>
      </Grid>
      <Grid item sm={4}>
        <Stack>
          <Button
            onClick={() =>
              navigate(
                selectedNode?.parentId
                  ? '/folders/' + selectedNode.parentId
                  : '/dashboard'
              )
            }
          >
            Back
          </Button>
          <List>
            <>
              {nodeList?.length &&
                nodeList.map((node) => (
                  <ListItem
                    onClick={() => openFile(node.id)}
                    onDoubleClick={() =>
                      node.isFolder
                        ? navigate('/folders/' + node.id)
                        : openFile(node.id)
                    }
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        {node.isFolder ? <FolderIcon /> : <FileIcon />}
                      </ListItemIcon>
                      <ListItemText>{node.name}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
            </>
          </List>
        </Stack>
      </Grid>
      <Grid item sm={4} p={2}>
        {isFileOpen && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Detail</Typography>
              <CloseIcon onClick={() => setIsFileOpen(false)} />
            </Stack>
            <FormLabel>Name</FormLabel>
            <Typography>{detailNode?.name}</Typography>
            <FormLabel>Owner</FormLabel>
            <Typography>{detailNode?.owner?.name}</Typography>
            <Typography>{detailNode?.owner?.email}</Typography>

            {detailNode?.content && (
              <>
                <FormLabel>Content</FormLabel>
                <Typography>{detailNode?.content}</Typography>
              </>
            )}
          </Stack>
        )}
      </Grid>
    </Grid>
  )
}
