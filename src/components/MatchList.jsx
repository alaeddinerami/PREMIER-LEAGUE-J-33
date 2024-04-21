import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches } from "../redux/matchSlice";
import MatchDetails from "./MatchDetails";
import "ldrs/ping";
import Navigation from "./Navigation";
import { Button, Modal } from "flowbite-react";
import Swal from "sweetalert2";

export default function MatchList() {
  const dispatch = useDispatch();
  const { matches, loading, error } = useSelector((state) => state.matches);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const matchesPerPage = 6;
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setOpenModal(true);
  };

  if (error) {
    Swal.fire({
      title: "Error!",
      text: error,
      icon: "error",
      confirmButtonText: "Ok",
      timer: 3000,
      timerProgressBar: true,
    });
  }

  return (
    <div>
      <Navigation />
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <MatchDetails match={selectedMatch} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
      <div className='flex flex-col justify-between h-[91vh] mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>
          Premier League Match Results
        </h1>
        {loading ? (
          <div className='w-full h-[50vh] flex items-center justify-center'>
            <l-ping size='45' speed='2' color='black'></l-ping>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentMatches.map((match) => (
              <div
                key={match.id}
                className='shadow-xl rounded-lg overflow-hidden cursor-pointer hover:text-gray-200 hover:bg-green-500 transform transition duration-300 ease-in-out'
                onClick={() => handleMatchClick(match)}
              >
                <div className='p-4 flex flex-col items-center'>
                  <h2 className='text-xl font-bold mb-2'>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </h2>
                  <p>
                    Date:{" "}
                    {new Date(match.startTimestamp * 1000).toLocaleDateString()}
                  </p>
                  {match.venue && <p>Venue: {match.venue.name}</p>}
                  {match.homeScore && match.awayScore && (
                    <p>
                      Score: {match.homeScore.current} -{" "}
                      {match.awayScore.current}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conditionally render MatchDetails */}
        <div className='flex justify-center mt-8'>
          <nav
            className='relative z-0 inline-flex shadow-sm -space-x-px'
            aria-label='Pagination'
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100'
            >
              Previous
            </button>
            <span className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
              Page {currentPage}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastMatch >= matches.length}
              className='relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100'
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
