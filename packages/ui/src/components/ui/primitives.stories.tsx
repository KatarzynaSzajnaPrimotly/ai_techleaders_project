import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Textarea } from './textarea';

const meta = {
  title: 'Primitives/First batch',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  name: 'Button',
  render: () => <div className="flex flex-wrap items-center gap-related">
    <Button>Continue</Button>
    <Button variant="secondary">Save draft</Button>
    <Button variant="outline">Cancel</Button>
    <Button variant="ghost">More options</Button>
    <Button variant="destructive">Remove</Button>
    <Button disabled>Unavailable</Button>
  </div>,
  parameters: { docs: { description: { story: 'Use one primary action per decision area. Keep destructive actions explicit and separate from routine navigation. The focus outline remains visible in both themes.' } } },
};

export const Badges: Story = {
  name: 'Badge',
  render: () => <div className="flex flex-wrap items-center gap-group">
    <Badge>Invited</Badge>
    <Badge variant="secondary">Draft</Badge>
    <Badge variant="outline">Upcoming</Badge>
    <Badge variant="success">Confirmed</Badge>
    <Badge variant="warning">Needs attention</Badge>
    <Badge variant="error">Payment failed</Badge>
  </div>,
  parameters: { docs: { description: { story: 'Use short, factual labels. Status badges include text so color is never the only signal. Do not add a badge for decoration or duplicate nearby text.' } } },
};

export const Cards: Story = {
  name: 'Card',
  render: () => <Card className="max-w-reading">
    <CardHeader>
      <CardTitle>Session details</CardTitle>
      <CardDescription>Review the plan before choosing a time.</CardDescription>
    </CardHeader>
    <CardContent><p className="text-body leading-body">A 25-minute text session focused on one concrete engineering question.</p></CardContent>
  </Card>,
  parameters: { docs: { description: { story: 'Use a panel when content forms a meaningful group. Avoid wrapping every section in a card; the outline is decorative and does not communicate control state.' } } },
};

export const Tables: Story = {
  name: 'Table',
  render: () => <Table>
    <caption className="p-related text-left text-text-muted">Upcoming sessions</caption>
    <TableHeader><TableRow><TableHead scope="col">Mentor</TableHead><TableHead scope="col">Time</TableHead><TableHead scope="col">Status</TableHead></TableRow></TableHeader>
    <TableBody>
      <TableRow><TableCell>Sam Rivera</TableCell><TableCell>Tue, 14:30</TableCell><TableCell><Badge variant="success">Confirmed</Badge></TableCell></TableRow>
      <TableRow><TableCell>Alex Chen</TableCell><TableCell>Wed, 10:00</TableCell><TableCell><Badge variant="warning">Awaiting payment</Badge></TableCell></TableRow>
    </TableBody>
  </Table>,
  parameters: { docs: { description: { story: 'Use a semantic table for comparable row-and-column data. Keep row dividers subtle; never rely on the low-contrast divider token to mark a control boundary.' } } },
};

export const Inputs: Story = {
  name: 'Input',
  render: () => <div className="grid max-w-reading gap-related">
    <label className="grid gap-group text-label font-medium text-text-strong">Email address
      <Input type="email" autoComplete="email" placeholder="you@example.com" />
    </label>
    <label className="grid gap-group text-label font-medium text-text-strong">Password
      <Input type="password" autoComplete="current-password" defaultValue="example-password" />
    </label>
    <label className="grid gap-group text-label font-medium text-text-strong">Disabled field
      <Input disabled value="Managed by your organization" readOnly />
    </label>
    <label className="grid gap-group text-label font-medium text-text-strong">Invalid email
      <Input type="email" aria-invalid="true" aria-describedby="email-error" defaultValue="not-an-email" />
      <span id="email-error" className="text-meta text-status-error">Enter a valid email address.</span>
    </label>
  </div>,
  parameters: { docs: { description: { story: 'Use a visible label, the correct input type, and relevant autocomplete. Associate validation text with aria-describedby and set aria-invalid when invalid.' } } },
};

export const Textareas: Story = {
  name: 'Textarea',
  render: () => <label className="grid max-w-reading gap-group text-label font-medium text-text-strong">What would you like help with?
    <Textarea rows={4} placeholder="Describe one concrete engineering question…" />
    <span className="text-meta font-normal text-text-muted">Keep session notes private unless you choose to share them.</span>
  </label>,
  parameters: { docs: { description: { story: 'Use for multi-line answers, questions, or private notes. Give the field a visible label and explain privacy or length constraints nearby.' } } },
};
