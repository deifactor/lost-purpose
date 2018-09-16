import * as React from 'react';
import * as Cards from '../cards/cards';
import { NewDeckDialog } from './NewDeckDialog';
import { shallow } from 'enzyme';

function ignore(deck: Cards.Deck) {}

it("doesn't allow submission with an empty name", () => {
  const wrapper = shallow(<NewDeckDialog onNewDeck={ignore} />);
  expect(wrapper.find('button').prop('disabled')).toBeTruthy();
});
