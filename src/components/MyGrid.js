import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BlockIcon from "@mui/icons-material/Block";

export default function MyGrid({ data }) {
  const handleDownloadClick = (id) => {
    const fileHash = data[id].reviewFileHash;
    // download the file from ipfs
    window.open(`https://${fileHash}.ipfs.dweb.link/`);
  };
  const handleOpenLink = (id) => {
    const proposal_id = data[id].proposalId;
    window.open(`https://www.tally.xyz/gov/test-78/proposal/${proposal_id}`);
  };
  const columns = [
    { field: "phase", headerName: "Review Status", width: 180 },
    { field: "issuer", headerName: "Reviewer Address", width: 300 },
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
      headerName: "Voting Proposal Link",
      width: 180,
      cellClassName: "actions",
      getActions: ({ id }) => {
        if (data[id].state === "Not Found")
          return [
            <GridActionsCellItem
              icon={<BlockIcon />}
              label="not found"
              className="textPrimary"
              color="inherit"
            />,
          ];
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
    { field: "state", headerName: "Voting Proposal State", width: 180 },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid autoHeight rows={data} columns={columns} />
    </Box>
  );
}
