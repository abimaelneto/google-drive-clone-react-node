import {
  Button,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import FileIcon from '@mui/icons-material/Description'
import EyeIcon from '@mui/icons-material/Visibility'
import MenuDotsIcon from '@mui/icons-material/MoreVert'

import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useState } from 'react'
import { detailFileNodesThunk } from '../../store/thunks/detail'

export const BaseLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { nodes, selectedNode, detailNode } = useAppSelector((s) => s.fileNodes)
  const [isFileOpen, setIsFileOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [selectedNodeForActions, setSelectedNodeForActions] = useState<
    string | null
  >(null)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const openFile = (nodeId: string) => {
    setIsFileOpen(true)
    dispatch(detailFileNodesThunk(nodeId))
  }
  const openMenu = (target: EventTarget, nodeId: string) => {
    setSelectedNodeForActions(nodeId)
    setIsMenuOpen(true)

    setMenuAnchor(target as HTMLElement)
  }
  const nodeList =
    (location.pathname.includes('folders') ? selectedNode?.children : nodes) ||
    []
  return (
    <Grid container>
      <Grid item sm={2}>
        <Link to="/dashboard">
          <Button>Home</Button>
        </Link>
      </Grid>
      <Grid item sm={6}>
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
            {nodeList?.length > 0 &&
              nodeList.map((node) => (
                <ListItem
                  onClick={() =>
                    node.isFolder
                      ? navigate('/folders/' + node.id)
                      : openFile(node.id)
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {node.isFolder ? <FolderIcon /> : <FileIcon />}
                    </ListItemIcon>
                    <ListItemText sx={{ flexGrow: 1 }}>
                      {node.name}
                    </ListItemText>
                    <ListItemIcon>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          openMenu(e.target, node.id)
                        }}
                      >
                        <MenuDotsIcon />

                        <Menu
                          onClose={() => {
                            setIsMenuOpen(false)
                            setMenuAnchor(null)
                          }}
                          anchorEl={menuAnchor}
                          open={isMenuOpen}
                          transformOrigin={{
                            horizontal: 'right',
                            vertical: 'top',
                          }}
                          anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MenuItem>teste</MenuItem>
                          <MenuItem>teste 2</MenuItem>
                        </Menu>
                      </IconButton>
                    </ListItemIcon>
                    <ListItemIcon>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          openFile(node.id)
                        }}
                      >
                        <EyeIcon />
                      </IconButton>
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Stack>
      </Grid>
      <Grid item sm={4} p={2}>
        {isFileOpen && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Detail</Typography>
              <IconButton onClick={() => setIsFileOpen(false)}>
                <CloseIcon />
              </IconButton>
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
