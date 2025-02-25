import { Bill } from "@/interfaces/bill";
import { Paper, Stack, Typography } from "@mui/material";

type Props = {
  bill: Bill;
};

export default function BillComponent({ bill }: Props) {
  return (
    <Paper sx={{ padding: 2 }}>
      <Stack>
        <Typography>{bill.title}</Typography>
      </Stack>
    </Paper>
  );
}
