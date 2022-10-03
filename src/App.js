import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import './App.css';

function App() {

  const [data, setData] = useState([])
  const [value, setValue] = useState("")
  const [sortValue, setSortValue] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageLimit] = useState(4)

  const sortOptions = [{ 'name': 'Nombre', 'value': 'title' },
  { 'name': 'Precio', 'value': 'price' },
  { 'name': 'Valoración', 'value': 'rating.rate' },
  { 'name': 'Popularidad', 'value': 'rating.count' },
  { 'name': 'Categoría', 'value': 'category' }]

  useEffect(() => {
    loadProductsData(0, 4, 0)
  }, [])

  const loadProductsData = async (start, end, increase) => {
    return await axios
      .get(`http://localhost:5000/products?_start=${start}&_end=${end}`)
      .then((response) => {
        setData(response.data)
        setCurrentPage(currentPage + increase)
      })
      .catch((err) => console.log(err))
  }

  const handleReset = () => {
    loadProductsData()
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(`http://localhost:5000/products?q=${value}`)
      .then((response) => {
        setData(response.data)
        setValue('')
      })
      .catch((err) => console.log(err))
  }

  const handleSort = async (e) => {
    let value = e.target.value
    setSortValue(value)
    return await axios
      .get(`http://localhost:5000/products?_sort=${value}&_order=${value === 'title' || value === 'price' || value === 'category' ? 'asc' : 'desc'}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => console.log(err))
  }

  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:5000/products?stock=${value}`)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => console.log(err))
  }

  const renderPagination = () => {
    if (currentPage === 0) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadProductsData(4, 8, 1)}>
              Siguiente
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadProductsData((currentPage - 1) * 4, currentPage * 4, -1)}>
              Anterior
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadProductsData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)}>
              Siguiente
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else {
      return (
        <MDBPagination className='mb-0'>

          <MDBPaginationItem>
            <MDBBtn onClick={() => loadProductsData(4, 8, -1)}>
              Anterior
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
  }

  return (
    <MDBContainer>
      <form style={{
        margin: "auto", padding: "15px", maxWidth: "400px", alignContent: "center"
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}>
        <input
          type="text"
          className='form-control'
          placeholder='Search...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <MDBBtn type='submit' color='dark'>Buscar</MDBBtn>
        <MDBBtn className='mx-2' color='info' onClick={() => handleReset()}>Resetear</MDBBtn>
      </form>
      <div style={{ marginTop: "20px" }}>
        <h2 className='text-center'>Catálogo</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Nombre</th>
                  <th scope='col'>Precio</th>
                  <th scope='col'>Valoración</th>
                  <th scope='col'>Vendidos</th>
                  <th scope='col'>Categoría</th>
                  <th scope='col'>Stock</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className='align-center mb-0'>
                  <tr>
                    <td colSpan={8} className='text-center mb-0'>No data found</td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope='row'>{item.id}</th>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{item.rating.rate}</td>
                      <td>{item.rating.count}</td>
                      <td>{item.category}</td>
                      <td>{item.stock ? 'Disponible' : 'No disponible'}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div style={{
          margin: "auto", padding: "15px", maxWidth: "400px", alignContent: "center"
        }}>{renderPagination()}</div>
      </div>
      <MDBRow>
        <MDBCol size='8'>
          <h5>Ordenar por:</h5>
          <select style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={handleSort}
            value={sortValue}
          >
            <option>Select value</option>
            {sortOptions.map((item, index) => (
              <option value={item.value} key={index}>{item.name}</option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size='4'>
          <h5>Filtrar por disponibilidad</h5>
          <MDBBtnGroup>
            <MDBBtn color='success' onClick={() => handleFilter(true)}>Disponible</MDBBtn>
            <MDBBtn color='danger' style={{ marginLeft: '2px' }} onClick={() => handleFilter(false)}
            >No disponible </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer >
  );
}

export default App;
