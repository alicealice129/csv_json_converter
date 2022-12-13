import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

afterEach(cleanup);

it('Check csv to json', () => {
  const {} = render(
    <Form/>,
  );

  expect(screen.getByPlaceholderText('please paste the content of JSON file')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('please paste the content of csv file')).toBeInTheDocument();

  let elem = screen.getByPlaceholderText('please paste the content of csv file');
  userEvent.type(elem, 'Name,Address,Company\n\
  Marcus,"Schloßstraße 17, 98547 Kühndorf, Germany",Apple Inc.\n\
  John,"Tropical-Islands-Allee 1, 15910 Krausnick, Germany",IKEA Furnitures\n\
  David,"Am Rheinufer 2, 65366 Geisenheim, Germany",Nokia Communications');

  userEvent.click(screen.getByText('CSV → JSON'));

  let json = JSON.parse(screen.getByPlaceholderText('please paste the content of JSON file').value)

  expect(json[2]["company"]).toEqual(expect.stringContaining('Nokia'));
});