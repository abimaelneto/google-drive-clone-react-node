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
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import FileIcon from '@mui/icons-material/Description'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import MenuDotsIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'

import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect, useState } from 'react'
import { detailFileNodesThunk } from '../../store/thunks/detail'
import { EditDialog } from '../../components/EditDialog'
import { startEditingNodeFilesThunk } from '../../store/thunks/startEdit'
import { FileNode } from '../../types/fileNode'
import { editFileNodesThunk } from '../../store/thunks/edit'
import { getFileNodesThunk } from '../../store/thunks/get'
import { listFileNodesThunk } from '../../store/thunks/list'
import { hasPermission } from '../../utils/hasPermission'
import { Permission } from '../../types/permissions'
import { isOwner } from '../../utils/isOwner'
import { listPermissions } from '../../utils/listPermissions'
import { meThunk } from '@/modules/auth/store/thunks/me'
import { Add, ArrowUpward } from '@mui/icons-material'
import { CreateDialog } from '../../components/CreateDialog'
import { createFileNodeThunk } from '../../store/thunks/create'

export const BaseLayout = ({ type }: { type: 'list' | 'get' }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const { user } = useAppSelector((s) => s.auth)
  const { nodes, selectedNode, detailNode, nodeToBeEdited } = useAppSelector(
    (s) => s.fileNodes
  )
  const [isFileOpen, setIsFileOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<
    '' | 'file' | 'folder'
  >('')

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
  }
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const openFile = async (nodeId: string) => {
    try {
      if (!detailNode || (detailNode && detailNode.id != nodeId))
        await dispatch(detailFileNodesThunk(nodeId)).unwrap()

      setIsFileOpen(true)
    } catch (err) {
      console.log(err)
      alert("You don't have the permissions to perform this action")
    }
  }
  const openMenu = (target: EventTarget) => {
    setIsMenuOpen(true)
    setMenuAnchor(target as HTMLElement)
  }

  const openEditDialog = async (nodeId: string) => {
    try {
      if (detailNode && detailNode.id !== nodeId)
        await dispatch(detailFileNodesThunk(nodeId)).unwrap()

      if (!hasPermissionToEditDetailNode) throw new Error('Unauthorized')
      await dispatch(startEditingNodeFilesThunk(nodeId)).unwrap()
      setIsEditDialogOpen(true)
    } catch (err) {
      alert("You don't have the permissions to perform this action")
    }
  }
  const openCreateDialog = (type: 'file' | 'folder') => {
    setIsCreateDialogOpen(type)
    setIsMenuOpen(false)
    setMenuAnchor(null)
  }
  const handleEditNode = async ({ name, content }: Partial<FileNode>) => {
    try {
      await dispatch(
        editFileNodesThunk({
          id: nodeToBeEdited?.id as string,
          payload: { name, content },
        })
      ).unwrap()
      fetchFileNodes()
      if (nodeToBeEdited != null && detailNode?.id == nodeToBeEdited?.id)
        dispatch(detailFileNodesThunk(nodeToBeEdited?.id))
      setIsEditDialogOpen(false)
    } catch (err) {
      console.log(err)
    }
  }
  const handleCreateNode = async ({ name, content }: Partial<FileNode>) => {
    try {
      await dispatch(
        createFileNodeThunk({
          name,
          content,
          isFolder: isCreateDialogOpen == 'folder',
          parentId: selectedNode ? selectedNode.id : null,
        })
      ).unwrap()
      fetchFileNodes()

      setIsCreateDialogOpen('')
    } catch (err) {
      console.log(err)
    }
  }
  const nodeList =
    (location.pathname.includes('folders') ? selectedNode?.children : nodes) ||
    []
  const handleNavigate = async (node: FileNode) => {
    try {
      await dispatch(getFileNodesThunk(node.id)).unwrap()
      node.isFolder ? navigate('/folders/' + node.id) : openFile(node.id)
    } catch (err) {
      if (err == 'Unauthorized')
        alert("You don't have the permissions to perform this action")
    }
  }
  const fetchFileNodes = async () => {
    try {
      if (type == 'list') {
        await dispatch(listFileNodesThunk()).unwrap()
      } else {
        await dispatch(getFileNodesThunk(params?.fileNodeId as string)).unwrap()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleGoToParent = async () => {
    try {
      if (selectedNode != null) {
        await dispatch(getFileNodesThunk(selectedNode.parentId)).unwrap()
        navigate('/folders/' + selectedNode.parentId)
      }
    } catch (err) {
      navigate('/dashboard')
      dispatch({ type: 'fileNode/resetSelectedNode' })
    }
  }

  const hasPermissionToEditDetailNode =
    detailNode &&
    detailNode?.permissions &&
    (isOwner(detailNode?.permissions, user?.email as string) ||
      hasPermission(detailNode?.permissions, 'WRITE'))

  const selectedNodePermissions =
    selectedNode?.permissions && user
      ? listPermissions(selectedNode?.permissions, user?.email)
      : []
  useEffect(() => {
    fetchFileNodes()
    if (!user) dispatch(meThunk())
  }, [params.fileNodeId])
  return (
    <>
      <Grid container>
        <Grid item sm={2}>
          <Link to="/dashboard">
            <Button>Home</Button>
          </Link>
        </Grid>

        <Grid item sm={4} p={2}>
          <Stack>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography sx={{ flexGrow: 1 }}>
                {selectedNode?.name || 'My Drive'}
              </Typography>

              <Button
                disabled={
                  type == 'get' && !selectedNodePermissions.includes('WRITE')
                }
                fullWidth={false}
                onClick={(e) => {
                  e.stopPropagation()
                  openMenu(e.target)
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Add />
                  <Typography>New</Typography>
                </Stack>

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
                  <MenuItem onClick={() => openCreateDialog('file')}>
                    File
                  </MenuItem>
                  <MenuItem onClick={() => openCreateDialog('folder')}>
                    Folder
                  </MenuItem>
                </Menu>
              </Button>
            </Stack>
            <List sx={{ maxHeight: '80vh', overflow: 'auto' }}>
              {type == 'get' && (
                <IconButton onClick={handleGoToParent}>
                  <ArrowUpward />
                </IconButton>
              )}
              {nodeList?.length > 0 &&
                nodeList.map((node) => (
                  <ListItem onClick={() => handleNavigate(node)}>
                    <ListItemButton>
                      <ListItemIcon>
                        {node.isFolder ? <FolderIcon /> : <FileIcon />}
                      </ListItemIcon>
                      <ListItemText sx={{ flexGrow: 1 }}>
                        {node.name}
                      </ListItemText>

                      <ListItemIcon></ListItemIcon>
                      <ListItemIcon>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            openFile(node.id)
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Stack>
        </Grid>
        <Grid item sm={4} p={2}>
          {isFileOpen && detailNode != null && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {detailNode.name}
                </Typography>

                <IconButton
                  disabled={!hasPermissionToEditDetailNode}
                  onClick={(e: { stopPropagation: () => void }) => {
                    openEditDialog(detailNode.id)
                    e.stopPropagation()
                  }}
                >
                  <EditIcon />
                </IconButton>
                <EditDialog
                  open={isEditDialogOpen}
                  handleClose={handleCloseEditDialog}
                  handleSubmit={handleEditNode}
                />
                <IconButton onClick={() => setIsFileOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <FormLabel>Owner</FormLabel>
              <Typography>{detailNode?.owner?.name}</Typography>
              <Typography>{detailNode?.owner?.email}</Typography>
              <FormLabel>Permissions</FormLabel>
              <Typography>
                {listPermissions(
                  detailNode?.permissions as Permission[],
                  user?.email as string
                ).join(', ')}
              </Typography>
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
      <CreateDialog
        handleClose={() => {
          setIsCreateDialogOpen('')
        }}
        type={isCreateDialogOpen}
        handleSubmit={handleCreateNode}
      />
    </>
  )
}
