import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
const rows = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

export default function MyGrid({ data }) {
  const handleDownloadClick = (id) => {
    console.log(id);
  };
  const handleOpenLink = (proposal_id) => {
    window.open(`https://www.tally.xyz/gov/test-78/proposal/${proposal_id}`);
  };
  const columns = [
    { field: "col1", headerName: "IDs", width: 100 },
    {
      field: "actions",
      type: "actions",
      headerName: "Review File",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FileDownloadIcon />}
            label="Download"
            className="textPrimary"
            onClick={() => handleDownloadClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "votingLink",
      type: "actions",
      headerName: "Start Voting",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<OpenInNewIcon />}
            label="openLink"
            className="textPrimary"
            onClick={() => handleOpenLink(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
