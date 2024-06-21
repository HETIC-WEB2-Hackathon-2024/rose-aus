import { List, Paper } from "@mui/material";

export default function Listing({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div>
      <h3>{title}</h3>
      <Paper style={{ maxHeight: 600, overflow: "auto" }}>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingLeft: "25px",
          }}
        >
          {children}
        </List>
      </Paper>
    </div>
  );
}

export function Card() {
  return <div>Listing</div>;
}
