import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 12,
      fontFamily: 'ReportCustomFont',
      fontWeight: 400,
      color: '#000',
      backgroundColor: '#ffffe2',
    },
    pageInner: {
      position: 'relative',
      border: '2px solid #5a6363',
      padding: 20,
    },
    pageInner1: {
      position: 'relative',
      border: '2px solid #5a6363',
      padding: 5,
    },
    bullet: {
      position: 'absolute',
      width: 14,
      height: 14,
      fontSize: 8,
      color: '#5a6363',
      border: '2px solid #5a6363',
      lineHeight: 12,
      textAlign: 'center',
    },
    bulletTopLeft: {
      top: -2,
      left: -2,
    },
    bulletTopRight: {
      top: -2,
      right: -2,
    },
    bulletBottomLeft: {
      bottom: -2,
      left: -2,
    },
    bulletBottomRight: {
      bottom: -2,
      right: -2,
    },
    section: {
      display: 'flex',
      flexDirection: "row",
      marginBottom: 0,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
    },
    row: {
      flexDirection: "row",
    },
    label: {
      fontWeight: "bold",
      fontSize: 14,
      flex: 1,
      minWidth: 150,
      textAlign: "left"
    },
    value: {
      fontSize: 12,
      flex: 3,
      textAlign: "left"
    },
    tableContainer: {
      display: 'flex',
      flexDirection: "column",
      padding :"10 10",
      color :'rgb(53, 58, 58)',
      gap: 2
    },
    headerRow: {
      fontWeight: "600"
    },
    logoContainer: {
      display: "flex",
      justifyContent: "space-between", 
      alignItems: "center", 
      flexDirection : 'row',
      width: "100%", 
      marginBottom : 20,
      paddingBottom : 10,
      borderBottom : '1px dashed #000'
  
    },
    logo: { width: 60, height: 60},
    footer: {
      border: '1px solid #000',
      textAlign: "center",
      fontSize: 14,
      margin: '25 0',
      padding: 10
    },
    footer1: {
      textAlign: "center",
      fontSize: 14,
      margin: '25 0',
      padding: 10,
      color : 'red'
    },
    leftHeader: { textAlign: "center" , alignItems:"center" , color:'#000' },
    centerHeader: { textAlign: "center", alignItems:"center" ,color:'#000' },
    rightHeader: { textAlign: "center" , alignItems:"center" ,color:'#000' },
  });

  export default styles;