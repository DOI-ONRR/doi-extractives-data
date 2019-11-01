import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(2),
    flexGrow: 1
  },
  tabContainer: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    zIndex: 10
  },
  contentTop: {
    flexBasis: '100%',
    order: 0,
    minWidth: 280,
    marginBottom: 30
  },
  contentLeft: {
    flexBasis: '65%',
    minWidth: 280,
    order: 1
  },
  contentRight: {
    flexBasis: '35%',
    order: 2,
    minWidth: 280
  },
  contentChildren: {
    flexBasis: '100%',
    minWidth: 280,
    order: 3
  },
  contentBottom: {
    flexBasis: '100%',
    minWidth: 280,
    order: 4
  }
}))

const TabContainer = props => {
  const classes = useStyles()
  return (
    <section className={classes.section}>
      <Grid container spacing={2} direction={'row'} justify={'space-between'} align={'flex-start'}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {props.title}
          </Typography>
          <Typography variant="body1">
            {props.info}
          </Typography>
        </Grid>
        <Grid item xs={6}>{props.contentLeft}</Grid>
        <Grid item xs={6}>{props.contentRight}</Grid>
        <Grid item xs={12}>
          <div className={classes.contentChildren}>{props.children}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.contentBottom}>{props.contentBottom}</div>
        </Grid>
      </Grid>
    </section>
  )
}

export default TabContainer
