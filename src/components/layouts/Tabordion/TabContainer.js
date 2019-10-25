import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
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
  title: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightBold,
    // fontSize: theme.typography.title.fontSize,
    // color: theme.typography.title.color,
    // textAlign: theme.typography.title.textAlign,
    // lineHeight: theme.typography.title.lineHeight
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
})

const TabContainer = props => {
  const { classes } = props
  return (
    <section className={classes.section}>
      <Grid container spacing={2} direction={'row'} justify={'space-between'} align={'flex-start'}>
        <Grid item xs='12'>
          <h3 className={classes.title}>{props.title}</h3>
          <span className={classes.info}>{props.info}</span>
        </Grid>
        <Grid item xs='6'>{props.contentLeft}</Grid>
        <Grid item xs='6'>{props.contentRight}</Grid>
        <Grid item xs='12'>
          <div className={classes.contentChildren}>{props.children}</div>
        </Grid>
        <Grid item xs='12'>
          <div className={classes.contentBottom}>{props.contentBottom}</div>
        </Grid>
      </Grid>
    </section>
  );
};

export default withStyles(styles)(TabContainer)
